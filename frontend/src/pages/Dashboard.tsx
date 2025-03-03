import { useState } from "react";
import { AttendanceRecord } from "../interfaces/interfaces";

const API_URL = "http://localhost:3000";

const Dashboard = () => {
	const [classNumber, setClassNumber] = useState<number>(0);
	const [section, setSection] = useState<number>(0);
	const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(
		[]
	);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchAttendance = async () => {
		setLoading(true);
		setError(null);

		try {
			const queryParams = new URLSearchParams();
			if (classNumber)
				queryParams.append("class_number", classNumber.toString());
			if (section) queryParams.append("section", section.toString());

			const url = `${API_URL}/api/attendance/filter?${queryParams}`;
			console.log("🔍 Fetching data from:", url);

			const response = await fetch(url);
			console.log("📡 Response status:", response.status);

			const text = await response.text(); // Obtener la respuesta como texto
			console.log("📜 Response text:", text);

			if (!response.ok) {
				throw new Error(`HTTP Error! Status: ${response.status}`);
			}

			const data: AttendanceRecord[] = JSON.parse(text);
			console.log("✅ Data received:", data);

			setAttendanceData(data);
		} catch (err) {
			setError("Error al obtener datos");
			console.error("❌ Fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center p-6">
			<h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

			<div className="flex space-x-4 mb-4">
				<input
					type="text"
					placeholder="Class Number"
					value={classNumber}
					onChange={(e) => setClassNumber(Number(e.target.value))}
					className="border p-2 rounded"
				/>
				<input
					type="text"
					placeholder="Section"
					value={section}
					onChange={(e) => setSection(Number(e.target.value))}
					className="border p-2 rounded"
				/>
				<button
					onClick={fetchAttendance}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				>
					Filtrar
				</button>
			</div>

			{loading && <p>Cargando...</p>}
			{error && <p className="text-red-500">{error}</p>}

			<table className="w-full max-w-4xl border-collapse border border-gray-300 mt-4">
				<thead>
					<tr className="bg-gray-200">
						<th className="border p-2">Nombre</th>
						<th className="border p-2">Email</th>
						<th className="border p-2">Clase</th>
						<th className="border p-2">Sección</th>
						<th className="border p-2">Fecha</th>
					</tr>
				</thead>
				<tbody>
					{attendanceData.length > 0 ? (
						attendanceData.map((att, index) => (
							<tr key={index} className="border">
								<td className="border p-2">{att.name}</td>
								<td className="border p-2">{att.email}</td>
								<td className="border p-2">
									{att.class_number}
								</td>
								<td className="border p-2">{att.section}</td>
								<td className="border p-2">
									{new Date(att.timestamp).toLocaleString()}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={5} className="p-4 text-center">
								No hay datos
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Dashboard;
