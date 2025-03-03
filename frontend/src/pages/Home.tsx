import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useLocation } from "../contexts/LocationContext";

const API_URL = "http://localhost:3000";

const Home = () => {
	const navigate = useNavigate();
	const { setUser } = useUser();
	const { location, locationError } = useLocation();
	const [loading, setLoading] = useState(false);

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
						console.error("Error en autenticación:", data.error);
					}
				})
				.catch((error) =>
					console.error("Error en el intercambio de token:", error)
				)
				.finally(() => setLoading(false));
		}
	}, [navigate, setUser]);

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold mb-4">Bienvenido</h1>
			{locationError && (
				<p className="text-red-500">
					Debes permitir la ubicación para continuar.
				</p>
			)}
			<button
				onClick={loginWithGoogle}
				className={`px-6 py-2 text-white rounded-lg ${
					location
						? "bg-blue-500 hover:bg-blue-600"
						: "bg-gray-400 cursor-not-allowed"
				}`}
				disabled={!location || loading}
			>
				{loading ? "Autenticando..." : "Iniciar sesión con Google"}
			</button>
		</div>
	);
};

export default Home;
