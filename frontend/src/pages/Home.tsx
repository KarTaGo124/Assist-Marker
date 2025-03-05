"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useLocation } from "../contexts/LocationContext";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";

const API_URL = "http://52.202.218.202:3000";

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
		padding: "24px",
		textAlign: "center" as const,
		border: "1px solid #e5e7eb",
		marginBottom: "20px",
	},
	title: {
		fontSize: "24px",
		fontWeight: "700",
		color: "#4c1d95",
		marginBottom: "20px",
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	},
	googleButton: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "12px 16px",
		backgroundColor: "#6d28d9",
		color: "white",
		border: "none",
		borderRadius: "8px",
		fontSize: "16px",
		fontWeight: "500",
		cursor: "pointer",
		transition: "all 0.2s ease",
		boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
		marginBottom: "16px",
	},
	googleButtonHover: {
		backgroundColor: "#5b21b6",
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.12)",
		transform: "translateY(-1px)",
	},
	googleButtonDisabled: {
		backgroundColor: "#9ca3af",
		cursor: "not-allowed",
		opacity: 0.7,
	},
	googleIcon: {
		marginRight: "12px",
		width: "20px",
		height: "20px",
	},
	errorMessage: {
		backgroundColor: "#fee2e2",
		borderLeft: "4px solid #ef4444",
		padding: "12px",
		marginBottom: "16px",
		borderRadius: "6px",
		textAlign: "left" as const,
		color: "#b91c1c",
		fontSize: "14px",
	},
	description: {
		color: "#6b7280",
		fontSize: "14px",
		marginBottom: "24px",
		lineHeight: "1.5",
	},
	footer: {
		color: "#6b7280",
		fontSize: "12px",
		marginTop: "24px",
		textAlign: "center" as const,
	},
	loadingSpinner: {
		animation: "spin 1s linear infinite",
		marginRight: "8px",
		width: "20px",
		height: "20px",
	},
};

const Home = () => {
	const navigate = useNavigate();
	const { setUser } = useUser();
	const { location, locationError } = useLocation();
	const [loading, setLoading] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);

	const loginWithGoogle = async () => {
		if (!location) {
			alert("Debes permitir la ubicación para iniciar sesión.");
			return;
		}

		try {
			const response = await fetch(`${API_URL}/auth/google`);
			const data = await response.json();
			if (data.authUrl) {
				window.location.href = data.authUrl;
			}
		} catch (error) {
			console.error("Error obteniendo la URL de Google:", error);
		}
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");

		if (code) {
			setLoading(true);
			fetch(`${API_URL}/auth/google/token`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code }),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.user) {
						setUser(data.user);
						navigate(
							data.user.role === "student"
								? "/mark-attendance"
								: "/dashboard"
						);
					} else {
						navigate("/");
						setAuthError("No estás inscrito en el curso");
					}
				})
				.catch((error) => {
					console.error("Error en el intercambio de token:", error);
					setAuthError("Ocurrió un error al autenticar");
				})
				.finally(() => setLoading(false));
		}
	}, [navigate, setUser]);

	useEffect(() => {
		if (authError) {
			alertify.error(authError);
		}
	}, [authError]);

	return (
		<div style={styles.container}>
			<div style={styles.card}>
				<h1 style={styles.title}>Cloud Computing 2025-1</h1>

				{locationError && (
					<div style={styles.errorMessage}>
						Debes permitir la ubicación para continuar.
					</div>
				)}

				<button
					onClick={loginWithGoogle}
					disabled={!location || loading}
					style={{
						...styles.googleButton,
						...(isHovered && !loading && location
							? styles.googleButtonHover
							: {}),
						...(!location || loading
							? styles.googleButtonDisabled
							: {}),
					}}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{loading ? (
						<>
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
									stroke="currentColor"
									strokeWidth="4"
									opacity="0.25"
								/>
								<path
									opacity="0.75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Autenticando...
						</>
					) : (
						<>
							<svg
								style={styles.googleIcon}
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill="currentColor"
									d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
								/>
							</svg>
							Iniciar sesión con Google
						</>
					)}
				</button>

				<p style={styles.description}>
					Inicia sesión para registrar tu asistencia o ver el panel de
					administración.
				</p>
			</div>

			<footer style={styles.footer}>
				© {new Date().getFullYear()} Sistema de Asistencia Universitaria
			</footer>

			<style>
				{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @media (max-width: 480px) {
            ${styles.card.maxWidth} = "100%";
            ${styles.title.fontSize} = "20px";
            ${styles.googleButton.padding} = "10px 14px";
            ${styles.googleButton.fontSize} = "14px";
          }
        `}
			</style>
		</div>
	);
};

export default Home;
