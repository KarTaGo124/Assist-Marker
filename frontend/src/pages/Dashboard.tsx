import { useState, useEffect } from "react";
import type { AttendanceRecord } from "../interfaces/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);
		if (media.matches !== matches) {
			setMatches(media.matches);
		}
		const listener = () => {
			setMatches(media.matches);
		};
		media.addEventListener("change", listener);
		return () => media.removeEventListener("change", listener);
	}, [matches, query]);

	return matches;
};

const styles = {
	container: {
		minHeight: "100vh",
		background: "linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)",
		padding: "20px",
		maxWidth: "1200px",
		margin: "0 auto",
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
		display: "flex",
		flexDirection: "column" as const,
		gap: "16px",
		marginBottom: "20px",
		width: "100%", // Cambiar a width 100%
	},
	inputsContainer: {
		display: "flex",
		flexDirection: "column" as const,
		gap: "16px",
	},
	inputRow: {
		display: "flex",
		flexDirection: "column" as const,
		gap: "16px",
		width: "100%",
		"@media (min-width: 640px)": {
			flexDirection: "row" as const,
			justifyContent: "space-between",
			alignItems: "flex-end",
		},
	},
	inputWrapper: {
		width: "100%",
		"@media (min-width: 640px)": {
			width: "300px",
		},
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
		padding: "10px 12px",
		borderRadius: "6px",
		border: "1px solid #6d28d9",
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
		height: "42px",
		width: "120px",
		marginTop: "24px",
	},
	buttonHover: {
		backgroundColor: "#d97706",
		transform: "translateY(-1px)",
	},
	buttonContainer: {
		display: "flex",
		justifyContent: "center",
		width: "100%",
		marginTop: "16px",
		"@media (min-width: 640px)": {
			justifyContent: "flex-end",
			marginTop: "0",
		},
	},
	tableContainer: {
		backgroundColor: "white",
		borderRadius: "12px",
		overflow: "hidden",
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
		border: "1px solid #6d28d9",
		overflowX: "auto" as const,
	},
	table: {
		width: "100%",
		minWidth: "650px",
		borderCollapse: "collapse" as const,
		backgroundColor: "white",
	},
	tableHeader: {
		backgroundColor: "#6d28d9",
		color: "white",
		fontSize: "14px",
		fontWeight: "500",
		padding: "12px 16px",
		textAlign: "left" as const,
		borderBottom: "1px solid #6d28d9",
	},
	tableCell: {
		padding: "12px 16px",
		fontSize: "14px",
		color: "#374151",
		borderBottom: "1px solid #6d28d9",
		backgroundColor: "white",
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
		backgroundColor: "white",
	},
	toggleButtonContainer: {
		display: "flex",
		justifyContent: "center",
		marginBottom: "20px",
		"@media (min-width: 640px)": {
			justifyContent: "flex-end",
		},
	},
	toggleButton: {
		backgroundColor: "#10B981",
		color: "white",
		padding: "10px 20px",
		borderRadius: "6px",
		border: "none",
		fontSize: "14px",
		fontWeight: "500",
		cursor: "pointer",
		transition: "all 0.2s ease",
		width: "100%",
		maxWidth: "300px",
		"@media (min-width: 640px)": {
			width: "auto",
			minWidth: "200px",
		},
	},
	toggleButtonActive: {
		backgroundColor: "#EF4444",
	},
};

const Dashboard = () => {
	const isDesktop = useMediaQuery("(min-width: 640px)");
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
	const [isAttendanceActive, setIsAttendanceActive] =
		useState<boolean>(false);

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

	const toggleAttendance = async () => {
		try {
			const response = await fetch(`${API_URL}/api/attendance/state`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ active: !isAttendanceActive }),
			});

			if (!response.ok) {
				throw new Error("Error al cambiar el estado de asistencia");
			}

			const data = await response.json();
			setIsAttendanceActive(data.active);
		} catch (err) {
			console.error("Error al actualizar asistencia:", err);
		}
	};

	useEffect(() => {
		const fetchAttendanceState = async () => {
			try {
				const response = await fetch(`${API_URL}/api/attendance/state`);
				if (!response.ok) {
					throw new Error("Error al obtener estado de asistencia");
				}

				const data = await response.json();
				setIsAttendanceActive(data.active);
			} catch (err) {
				console.error("Error obteniendo estado de asistencia:", err);
			}
		};

		fetchAttendanceState();
	}, []);

	return (
		<div style={styles.container}>
			<header style={styles.header}>
				<h1 style={styles.headerTitle}>Panel de Administración</h1>
			</header>

			<div
				style={{
					...styles.toggleButtonContainer,
					justifyContent: isDesktop ? "flex-end" : "center",
				}}
			>
				<button
					onClick={toggleAttendance}
					style={{
						...styles.toggleButton,
						...(isAttendanceActive
							? styles.toggleButtonActive
							: {}),
						width: isDesktop ? "auto" : "100%",
						maxWidth: isDesktop ? "none" : "300px",
					}}
				>
					{isAttendanceActive
						? "Desactivar Asistencia"
						: "Activar Asistencia"}
				</button>
			</div>

			<div style={styles.filterCard}>
				<h2 style={styles.filterTitle}>Filtrar Asistencias</h2>

				<div style={styles.formGroup}>
					<div
						style={{
							...styles.inputRow,
							flexDirection: isDesktop ? "row" : "column",
							alignItems: isDesktop ? "flex-end" : "stretch",
						}}
					>
						<div
							style={{
								...styles.inputWrapper,
								width: isDesktop ? "300px" : "100%",
							}}
						>
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

						<div
							style={{
								...styles.buttonContainer,
								justifyContent: isDesktop
									? "flex-end"
									: "center",
							}}
						>
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

					<div
						style={{
							...styles.inputWrapper,
							width: isDesktop ? "300px" : "100%",
						}}
					>
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
				</div>

				{error && <div style={styles.errorMessage}>{error}</div>}
			</div>

			<div style={styles.tableContainer}>
				<table style={styles.table}>
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
