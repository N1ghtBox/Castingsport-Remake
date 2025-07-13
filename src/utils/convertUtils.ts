export const TimeToSeconds = (time: string): number => {
	const [minutes, seconds, miliseconds] = time.split(".").map(Number);
	return minutes * 60 + seconds + miliseconds / 1000;
};
