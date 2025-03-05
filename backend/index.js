require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const AWS = require('aws-sdk');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');

AWS.config.update({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  sessionToken: process.env.aws_session_token,
  region: process.env.AWS_REGION
});

const dynamo = new AWS.DynamoDB.DocumentClient();
const app = express();

const options = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.cert')
};

const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  credentials: true
};
app.use(cors(corsOptions));

const PORT = process.env.PORT;

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'clave-secreta',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// 📌 Devolver la URL de autenticación de Google
app.get('/auth/google', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.FRONTEND_URL}/auth/callback&response_type=code&scope=profile email`;
  res.json({ authUrl });
});

// 📌 Recibir el código y devolver datos del usuario sin sesión
app.post('/auth/google/token', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Código no recibido' });

  try {
    // Intercambiar código por token de acceso
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: `${process.env.FRONTEND_URL}/auth/callback`,
        grant_type: 'authorization_code',
        code
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) return res.status(400).json({ error: 'Error obteniendo token' });

    // Obtener datos del usuario con el token
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = await userResponse.json();

    // Buscar usuario en DynamoDB
    const email = userData.email;
    const data = await dynamo.get({ TableName: process.env.TABLE_NAME_1, Key: { email } }).promise();
    const user = data.Item;

    if (!user) return res.status(401).json({ error: 'Usuario no registrado en la tabla Users' });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/userinfo', (req, res) => {
  res.status(401).json({ error: 'No autenticado' });
});


// 📌 Obtener el estado de la asistencia desde DynamoDB
app.get('/api/attendance/state', async (req, res) => {
  try {
    const data = await dynamo.get({ TableName: process.env.TABLE_NAME_3, Key: { id: 'attendance_state' } }).promise();
    res.json({ active: data.Item ? data.Item.active : false });
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo estado de asistencia' });
  }
});

// 📌 Activar/desactivar asistencia en DynamoDB
app.post('/api/attendance/state', async (req, res) => {
  const { active } = req.body;
  if (typeof active !== 'boolean') {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    // Guardar en Dynamo
    await dynamo.put({
      TableName: process.env.TABLE_NAME_3,
      Item: { id: 'attendance_state', active },
    }).promise();

    // Devolver también el valor actualizado de `active`
    res.json({
      active,
      message: `Asistencia ${active ? 'activada' : 'desactivada'}`,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando estado de asistencia' });
  }
});

// mis coordenadas
const AUDITORIUM_LAT = process.env.AUDITORIUM_LAT;
const AUDITORIUM_LNG = process.env.AUDITORIUM_LNG;

const RADIUS_METERS = process.env.RADIUS_METERS;

// Función para calcular distancia con la fórmula de Haversine
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}

// 📌 Verificar asistencia con token
app.post('/api/attendance', async (req, res) => {
  try {
    const attendanceState = await dynamo.get({ TableName: process.env.TABLE_NAME_3, Key: { id: 'attendance_state' } }).promise();
    if (!attendanceState.Item || !attendanceState.Item.active) {
      return res.status(403).json({ error: 'La asistencia no está activa' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Error verificando el estado de asistencia' });
  }
  
  const { email, class_number, timestamp, latitude, longitude } = req.body;
  if (!email || !class_number || !timestamp || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }
  
  // 📌 Verificar si el usuario está en la base de datos
  const userCheck = await dynamo.get({ TableName: process.env.TABLE_NAME_1, Key: { email } }).promise();
  if (!userCheck.Item) {
    return res.status(401).json({ error: 'Usuario no registrado' });
  }
  
  // 📌 Verificar si el usuario está dentro del rango permitido
  const distance = getDistance(latitude, longitude, AUDITORIUM_LAT, AUDITORIUM_LNG);

  if (distance > RADIUS_METERS) {
    return res.status(403).json({ error: "Acércate más al auditorio para registrar tu asistencia" });
  }

  // 📌 Guardar asistencia en DynamoDB
  const params = {
    TableName: process.env.TABLE_NAME_2,
    Item: {
      email,
      class_number,
      timestamp,
      latitude,
      longitude
    }
  };

  try {
    await dynamo.put(params).promise();
    res.json({ message: "Asistencia registrada exitosamente" });
  } catch (err) {
    console.error("Error registrando asistencia:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


app.get('/api/attendance/filter', async (req, res) => {
  try {
      const classNumber = req.query.class_number ? Number(req.query.class_number) : null;
      const section = req.query.section ? Number(req.query.section) : null;

      // Obtener asistencia
      const attendanceData = await dynamo.scan({ TableName: process.env.TABLE_NAME_2 }).promise();

      // Obtener usuarios
      const usersData = await dynamo.scan({ TableName: process.env.TABLE_NAME_1 }).promise();

      // Convertir usuarios a un mapa { email: { name, section } }
      const usersMap = {};
      usersData.Items.forEach(user => {
          usersMap[user.email] = { 
              name: user.name || "Desconocido", 
              section: user.section ? Number(user.section) : 0 
          };
      });

      // Filtrar y unir datos
      let filteredData = attendanceData.Items.map(att => ({
          ...att,
          name: usersMap[att.email]?.name || "Desconocido",
          section: usersMap[att.email]?.section || 0
      }));

      if (classNumber !== null) {
          filteredData = filteredData.filter(att => Number(att.class_number) === classNumber);
      }
      if (section !== null) {
          filteredData = filteredData.filter(att => Number(att.section) === section);
      }

      // Ordenar por nombre
      filteredData.sort((a, b) => a.name.localeCompare(b.name));

      res.json(filteredData);
  } catch (err) {
      console.error("❌ Error obteniendo datos:", err);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Endpoint de salud para el target group
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
/*
https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor HTTPS corriendo en https://52.202.218.202:${PORT}`);
});
*/

app.listen(PORT, () => {
  console.log(`Servidor HTTP corriendo en http://52.202.218.202:${PORT}`);
});
