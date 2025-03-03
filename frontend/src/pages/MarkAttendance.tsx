"use client";

import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useLocation } from "../contexts/LocationContext";

const API_URL = "http://localhost:3000";

const styles = {
	container: {
		minHeight: "100vh",
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
		justifyContent: "center",
		padding: "20px",
		background: "linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)",
	},
	card: {
		width: "100%",
		maxWidth: "400px",
		backgroundColor: "white",
		borderRadius: "12px",
		boxShadow:
			"0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
		padding: "32px",
		textAlign: "center" as const,
		border: "1px solid #e5e7eb",
	},
	title: {
		fontSize: "24px",
		fontWeight: "700",
		color: "#0ea5e9",
		marginBottom: "24px",
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	},
	loadingContainer: {
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
		justifyContent: "center",
		padding: "32px 0",
	},
	loadingSpinner: {
		animation: "spin 1s linear infinite",
		width: "40px",
		height: "40px",
		marginBottom: "16px",
	},
	loadingText: {
		color: "#6b7280",
		fontSize: "16px",
	},
	errorMessage: {
		backgroundColor: "#fee2e2",
		borderLeft: "4px solid #ef4444",
		padding: "16px",
		marginBottom: "24px",
		borderRadius: "6px",
		textAlign: "left" as const,
		color: "#b91c1c",
		fontSize: "14px",
	},
	successContainer: {
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
		padding: "24px 0",
	},
	successIcon: {
		backgroundColor: "#ecfdf5",
		borderRadius: "50%",
		padding: "16px",
		marginBottom: "16px",
	},
	successTitle: {
		fontSize: "20px",
		fontWeight: "600",
		color: "#059669",
		marginBottom: "8px",
	},
	successMessage: {
		color: "#6b7280",
		fontSize: "14px",
		marginBottom: "24px",
	},
	button: {
		backgroundColor: "#0ea5e9",
		color: "white",
		padding: "10px 20px",
		borderRadius: "8px",
		border: "none",
		fontSize: "16px",
		fontWeight: "500",
		cursor: "pointer",
		transition: "all 0.2s ease",
	},
	buttonHover: {
		backgroundColor: "#0284c7",
		transform: "translateY(-1px)",
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.12)",
	},
};

const MarkAttendance = () => {
	const { user } = useUser();
	const { location } = useLocation();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);
	const [isHovered, setIsHovered] = useState(false);

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
		<div style={styles.container}>
			<div style={styles.card}>
				<h1 style={styles.title}>Registro de Asistencia</h1>

				{loading && (
					<div style={styles.loadingContainer}>
						<svg
							style={styles.loadingSpinner}
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="#0ea5e9"
								strokeWidth="4"
								opacity="0.25"
							/>
							<path
								opacity="0.75"
								fill="#0ea5e9"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						<p style={styles.loadingText}>
							Registrando asistencia...
						</p>
					</div>
				)}

				{error && <div style={styles.errorMessage}>{error}</div>}

				{success && (
					<div style={styles.successContainer}>
						<div style={styles.successIcon}>
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#059669"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M20 6L9 17l-5-5" />
							</svg>
						</div>
						<h2 style={styles.successTitle}>
							¡Asistencia registrada con éxito!
						</h2>
						<p style={styles.successMessage}>
							Tu asistencia ha sido registrada correctamente en el
							sistema.
						</p>
						<button
							onClick={() => (window.location.href = "/")}
							style={{
								...styles.button,
								...(isHovered ? styles.buttonHover : {}),
							}}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
						>
							Volver al inicio
						</button>
					</div>
				)}
			</div>

			<style>
				{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
			</style>
		</div>
	);
};

export default MarkAttendance;
