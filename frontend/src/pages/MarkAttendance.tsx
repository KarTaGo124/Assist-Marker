import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useLocation } from "../contexts/LocationContext";

const API_URL = "http://localhost:3000";

const MarkAttendance = () => {
	const { user } = useUser();
	const { location } = useLocation();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);

	useEffect(() => {
		if (!user || !location) {
			setError("Falta información del usuario o la ubicación.");
			setLoading(false);
			return;
		}

		const attendanceData = {
			email: user.email,
			class_number: 1,
			timestamp: new Date().toISOString(),
			latitude: location.latitude,
			longitude: location.longitude,
		};

		fetch(`${API_URL}/api/attendance`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(attendanceData),
		})
			.then(async (res) => {
				const data = await res.json();
				if (res.ok) {
					setSuccess(true);
				} else {
					setError(
						data.error || "No se pudo registrar la asistencia."
					);
				}
			})
			.catch(() => setError("Error al registrar la asistencia."))
			.finally(() => setLoading(false));
	}, [user, location]);

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-xl font-bold mb-4">Registro de asistencia</h1>
			{loading && <p>Cargando...</p>}
			{error && <p className="text-red-500">{error}</p>}
			{success && (
				<p className="text-green-500">
					Asistencia registrada con éxito.
				</p>
			)}
		</div>
	);
};

export default MarkAttendance;
