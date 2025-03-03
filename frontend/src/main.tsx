import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/UserContext";
import { LocationProvider } from "./contexts/LocationContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<UserProvider>
			<LocationProvider>
				<App />
			</LocationProvider>
		</UserProvider>
	</React.StrictMode>
);
