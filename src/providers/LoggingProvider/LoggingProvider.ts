import { error, info, warn } from "@tauri-apps/plugin-log";

export class LoggingProvider {
	static LogInfo(message: string) {
		info(message);
		console.info(message)
	}

	static LogWarning(message: string) {
		warn(message);
		console.warn(message)
	}

	static LogData(message: string, data: object) {
		info(`${message}. Data: ${JSON.stringify(data)}`)
		console.info(`${message}. Data: ${JSON.stringify(data)}`)
	}

	/**
	 * Obsługa błędów i logowanie do pliku
	 * @param baseMessage Bazowa wiadomość logu
	 * @param ex Exception do logowania
	 */
	static LogException(baseMessage: string, ex: unknown) {
		let message = `${baseMessage}. Unknown error: ${ex}`
		if (ex instanceof Error) {
			message = `${baseMessage}. Error: ${ex.message}`;
		}
		error(message);
		console.error(message)
	}
}
