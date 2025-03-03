import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import MarkAttendance from "./pages/MarkAttendance";
import Dashboard from "./pages/Dashboard";
import { useUser } from "./contexts/UserContext";

const App = () => {
	const { user } = useUser(); // Obtener el usuario del contexto

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/auth/callback" element={<Home />} />
				<Route path="/mark-attendance" element={<MarkAttendance />} />

				{/* 🔹 Proteger el Dashboard para solo admins */}
				<Route
					path="/dashboard"
					element={
						user && user.role === "admin" ? (
							<Dashboard />
						) : (
							<Navigate to="/" />
						)
					}
				/>

				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Router>
	);
};

export default App;
