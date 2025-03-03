import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "./contexts/UserContext";
import { LocationProvider } from "./contexts/LocationContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<UserProvider>
			<LocationProvider>
				<App />
			</LocationProvider>
		</UserProvider>
	</React.StrictMode>
);
