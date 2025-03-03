"use client";

import { useState } from "react";
import type { AttendanceRecord } from "../interfaces/interfaces";

const API_URL = "http://localhost:3000";

const styles = {
	container: {
		minHeight: "100vh",
		background: "linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)",
		padding: "20px",
	},
	header: {
		backgroundColor: "#6d28d9",
		padding: "20px",
		marginBottom: "32px",
		borderRadius: "12px",
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
	},
	headerTitle: {
		color: "white",
		fontSize: "24px",
		fontWeight: "700",
		textAlign: "center" as const,
		margin: "0",
	},
	filterCard: {
		backgroundColor: "white",
		borderRadius: "12px",
		padding: "24px",
		marginBottom: "24px",
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
		border: "1px solid #e5e7eb",
	},
	filterTitle: {
		fontSize: "18px",
		fontWeight: "600",
		color: "#f59e0b",
		marginBottom: "20px",
		textAlign: "center" as const,
	},
	formGroup: {
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
		gap: "16px",
		marginBottom: "20px",
	},
	label: {
		display: "block",
		fontSize: "14px",
		fontWeight: "500",
		color: "#374151",
		marginBottom: "8px",
	},
	input: {
		width: "100%",
		padding: "8px 12px",
		borderRadius: "6px",
		border: "1px solid #d1d5db",
		fontSize: "14px",
		transition: "all 0.2s ease",
		outline: "none",
	},
	inputFocus: {
		borderColor: "#6d28d9",
		boxShadow: "0 0 0 2px rgba(109, 40, 217, 0.2)",
	},
	button: {
		backgroundColor: "#f59e0b",
		color: "white",
		padding: "10px 20px",
		borderRadius: "6px",
		border: "none",
		fontSize: "14px",
		fontWeight: "500",
		cursor: "pointer",
		transition: "all 0.2s ease",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	buttonHover: {
		backgroundColor: "#d97706",
		transform: "translateY(-1px)",
	},
	table: {
		width: "100%",
		backgroundColor: "white",
		borderRadius: "12px",
		overflow: "hidden",
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
		border: "1px solid #e5e7eb",
	},
	tableHeader: {
		backgroundColor: "#6d28d9",
		color: "white",
		fontSize: "14px",
		fontWeight: "500",
		padding: "12px 16px",
		textAlign: "left" as const,
	},
	tableCell: {
		padding: "12px 16px",
		fontSize: "14px",
		color: "#374151",
		borderBottom: "1px solid #e5e7eb",
	},
	tableRow: {
		transition: "background-color 0.2s ease",
	},
	tableRowHover: {
		backgroundColor: "#f5f3ff",
	},
	errorMessage: {
		backgroundColor: "#fee2e2",
		borderLeft: "4px solid #ef4444",
		padding: "12px 16px",
		marginBottom: "16px",
		borderRadius: "6px",
		color: "#b91c1c",
		fontSize: "14px",
	},
	emptyState: {
		textAlign: "center" as const,
		padding: "48px 0",
		color: "#6b7280",
	},
};

const Dashboard = () => {
	const [classNumber, setClassNumber] = useState<number>(0);
	const [section, setSection] = useState<number>(0);
	const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(
		[]
	);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [isHovered, setIsHovered] = useState(false);
	const [hoveredRow, setHoveredRow] = useState<number | null>(null);
	const [focusedInput, setFocusedInput] = useState<string | null>(null);

	const fetchAttendance = async () => {
		setLoading(true);
		setError(null);

		try {
			const queryParams = new URLSearchParams();
			if (classNumber)
				queryParams.append("class_number", classNumber.toString());
			if (section) queryParams.append("section", section.toString());

			const response = await fetch(
				`${API_URL}/api/attendance/filter?${queryParams}`
			);

			if (!response.ok) {
				throw new Error(`HTTP Error! Status: ${response.status}`);
			}

			const data = await response.json();
			setAttendanceData(data);
		} catch (err) {
			setError("Error al obtener datos");
			console.error("Error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={styles.container}>
			<header style={styles.header}>
				<h1 style={styles.headerTitle}>Panel de Administración</h1>
			</header>

			<div style={styles.filterCard}>
				<h2 style={styles.filterTitle}>Filtrar Asistencias</h2>

				<div style={styles.formGroup}>
					<div>
						<label style={styles.label} htmlFor="classNumber">
							Número de Clase
						</label>
						<input
							id="classNumber"
							type="number"
							value={classNumber || ""}
							onChange={(e) =>
								setClassNumber(Number(e.target.value))
							}
							placeholder="Ej: 1"
							style={{
								...styles.input,
								...(focusedInput === "classNumber"
									? styles.inputFocus
									: {}),
							}}
							onFocus={() => setFocusedInput("classNumber")}
							onBlur={() => setFocusedInput(null)}
						/>
					</div>

					<div>
						<label style={styles.label} htmlFor="section">
							Sección
						</label>
						<input
							id="section"
							type="number"
							value={section || ""}
							onChange={(e) => setSection(Number(e.target.value))}
							placeholder="Ej: 1"
							style={{
								...styles.input,
								...(focusedInput === "section"
									? styles.inputFocus
									: {}),
							}}
							onFocus={() => setFocusedInput("section")}
							onBlur={() => setFocusedInput(null)}
						/>
					</div>

					<div style={{ display: "flex", alignItems: "flex-end" }}>
						<button
							onClick={fetchAttendance}
							disabled={loading}
							style={{
								...styles.button,
								...(isHovered && !loading
									? styles.buttonHover
									: {}),
								opacity: loading ? 0.7 : 1,
							}}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
						>
							{loading ? "Cargando..." : "Filtrar"}
						</button>
					</div>
				</div>

				{error && <div style={styles.errorMessage}>{error}</div>}
			</div>

			<div style={styles.table}>
				<table
					style={{
						width: "100%",
						borderCollapse: "collapse" as const,
					}}
				>
					<thead>
						<tr>
							<th style={styles.tableHeader}>Nombre</th>
							<th style={styles.tableHeader}>Email</th>
							<th style={styles.tableHeader}>Clase</th>
							<th style={styles.tableHeader}>Sección</th>
							<th style={styles.tableHeader}>Fecha</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={5} style={styles.emptyState}>
									Cargando datos...
								</td>
							</tr>
						) : attendanceData.length > 0 ? (
							attendanceData.map((att, index) => (
								<tr
									key={index}
									style={{
										...styles.tableRow,
										...(hoveredRow === index
											? styles.tableRowHover
											: {}),
									}}
									onMouseEnter={() => setHoveredRow(index)}
									onMouseLeave={() => setHoveredRow(null)}
								>
									<td style={styles.tableCell}>{att.name}</td>
									<td style={styles.tableCell}>
										{att.email}
									</td>
									<td style={styles.tableCell}>
										{att.class_number}
									</td>
									<td style={styles.tableCell}>
										{att.section}
									</td>
									<td style={styles.tableCell}>
										{new Date(
											att.timestamp
										).toLocaleString()}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={5} style={styles.emptyState}>
									No hay datos disponibles
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Dashboard;
