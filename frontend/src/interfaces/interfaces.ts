export interface LocationData {
	latitude: number;
	longitude: number;
}

export interface User {
	email: string;
	name: string;
	section: number;
	role: string;
}

export interface AttendanceData {
	email: string;
	class_number: number;
	timestamp: string;
	latitude: number;
	longitude: number;
}

export interface ErrorState {
	message: string;
}

export interface AttendanceRecord {
	name: string;
	email: string;
	class_number: number;
	section: number;
	timestamp: string;
}
