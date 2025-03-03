import { createContext, useContext, useEffect, useState } from "react";

// 🔹 Definir la interfaz de ubicación
interface LocationData {
	latitude: number;
	longitude: number;
}

interface LocationContextType {
	location: LocationData | null;
	locationError: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(
	undefined
);

export const LocationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [location, setLocation] = useState<LocationData | null>(null);
	const [locationError, setLocationError] = useState(false);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocation({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
				setLocationError(false);
			},
			() => {
				setLocationError(true);
			}
		);
	}, []);

	return (
		<LocationContext.Provider value={{ location, locationError }}>
			{children}
		</LocationContext.Provider>
	);
};

export const useLocation = () => {
	const context = useContext(LocationContext);
	if (!context) {
		throw new Error("useLocation debe usarse dentro de LocationProvider");
	}
	return context;
};
