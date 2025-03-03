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
	const { user } = useUser();

	return (
		<Router>
			<div className="container mx-auto px-4 py-8">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/auth/callback" element={<Home />} />
					<Route
						path="/mark-attendance"
						element={
							user ? <MarkAttendance /> : <Navigate to="/" />
						}
					/>
					<Route
						path="/dashboard"
						element={
							user?.role === "admin" ? (
								<Dashboard />
							) : (
								<Navigate to="/" />
							)
						}
					/>
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
