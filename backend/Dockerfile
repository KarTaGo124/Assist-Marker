# Usa una imagen base oficial de Node.js
FROM node:18-alpine

# Crea y establece el directorio de trabajo en la imagen
WORKDIR /app

# Copia el package.json y package-lock.json (si tienes) al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install --production

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que tu aplicación corre (ej. 3000)
EXPOSE 3000

# Define la variable de entorno si es necesario (o pásala al correr el contenedor)
# ENV NODE_ENV=production

# Comando para arrancar la aplicación
CMD ["node", "index.js"]
