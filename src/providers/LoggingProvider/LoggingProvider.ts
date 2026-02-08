import { error, info, warn } from "@tauri-apps/plugin-log";

// biome-ignore lint/complexity/noStaticOnlyClass: Wrapper
export class LoggingProvider {
	static LogInfo(message: string) {
		info(message);
	}

	static LogWarning(message: string) {
		warn(message);
	}

	/**
	 * Obsługa błędów i logowanie do pliku
	 * @param baseMessage Bazowa wiadomość logu
	 * @param ex Exception do logowania
	 */
	static LogException(baseMessage: string, ex: unknown) {
		if (ex instanceof Error) {
			error(`${baseMessage}. Error: ${ex.message}`);
		} else {
			error(`${baseMessage}. Unknown error: ${ex}`);
		}
	}
}
