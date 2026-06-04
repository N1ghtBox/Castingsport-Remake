import {
	BaseDirectory,
	create,
	readFile,
	readTextFile,
	writeFile,
	writeTextFile,
} from "@tauri-apps/plugin-fs";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";
import type {
	Competition,
	OrderConfig,
	PlatformConfig,
	TimeConfig,
} from "@/types/Competition";
import { DefaultCompetition } from "@/types/CompetitionContext";
import type { Contestant } from "@/types/Contestant";
import type { CompetitionJsonData, GeneralListsJson } from "@/types/JsonData";
import type { Team } from "@/types/Teams";

export const getGeneralData = async (): Promise<GeneralListsJson> => {
	try {
		LoggingProvider.LogInfo("Reading general data file.");
		const contents = await readTextFile("data.json", {
			baseDir: BaseDirectory.AppData,
		});

		return JSON.parse(contents);
	} catch (error) {
		LoggingProvider.LogException(
			`Error during loading general json file.`,
			error,
		);

		toast.error("Nie udało się odczytać danych");
		return { competitions: [], series: [] };
	}
};

export const getCompetitionInfo = async (
	id: string,
): Promise<Competition | undefined> => {
	try {
		const contents = await getGeneralData();

		return contents.competitions.find((x) => x.id === id);
	} catch (error) {
		LoggingProvider.LogException(
			`Error during loading edit data for Competition id = ${id} `,
			error,
		);
		toast.error("Nie udało się odczytać danych");
		return DefaultCompetition;
	}
};

export const saveCompetitionLogo = async (
	array: Uint8Array,
	fileName: string,
): Promise<string> => {
	const imagePath = `logos/${fileName}`;
	try {
		await writeFile(imagePath, array, {
			baseDir: BaseDirectory.AppData,
		});

		return imagePath;
	} catch (error) {
		LoggingProvider.LogException(
			`Error during saving Competition logo to path: ${imagePath} `,
			error,
		);

		toast.error("Nie można odczytać logo zawodów");
		return "";
	}
};

const failedLogoPaths = new Set<string>();

export const getCompetitionLogo = async (path?: string): Promise<string> => {
	try {
		if (!path) return "";

		const logo = await readFile(path, {
			baseDir: BaseDirectory.AppData,
		});

		failedLogoPaths.delete(path);
		return URL.createObjectURL(new Blob([logo], { type: "image/png" }));
	} catch (error) {
		if (path && !failedLogoPaths.has(path)) {
			failedLogoPaths.add(path);
			LoggingProvider.LogException(
				`Error during fetching Competition logo from path: ${path} `,
				error,
			);
			toast.error("Nie można odczytać logo zawodów");
		}
		return "";
	}
};

export const getCompData = async (id: string): Promise<CompetitionJsonData> => {
	try {
		LoggingProvider.LogInfo(`Reading competition data file for id = ${id}.`);
		const contents = await readTextFile(`${id}.json`, {
			baseDir: BaseDirectory.AppData,
		});

		return JSON.parse(contents);
	} catch (error) {
		LoggingProvider.LogException(
			`Error during loading data for Competition id = ${id} `,
			error,
		);
		toast.error("Nie udało się odczytać zawodów");
		return { contestants: [], teams: [], name: "Brak danych" };
	}
};

export const updateCompInfo = async (
	id: string,
	compInfo: Omit<
		Competition,
		"id" | "platformConfig" | "timeConfig" | "orderConfig"
	>,
): Promise<void> => {
	try {
		LoggingProvider.LogData(`Updating competition id = ${id}.`, compInfo);
		const contents = await getGeneralData();

		const comp = contents.competitions.find((x) => x.id === id);

		if (!comp) {
			toast.error("Nie udało się zaktualizować zawodów");
			LoggingProvider.LogWarning(`Competition id = ${id} not found.`);
			return;
		}

		comp.dateFrom = compInfo.dateFrom;
		comp.dateTo = compInfo.dateTo;
		comp.mainJudge = compInfo.mainJudge;
		comp.secondaryJudge = compInfo.secondaryJudge;
		comp.logoUrl = compInfo.logoUrl;
		comp.name = compInfo.name;
		comp.place = compInfo.place;
		comp.lastSynced = compInfo.lastSynced;

		return await updateGeneralData(contents);
	} catch (error) {
		LoggingProvider.LogException(`Error during updating competition.`, error);
		toast.error("Nie udało się zaktualizować zawodów");
	}
};

export const updateCompData = async (
	id: string,
	contestants: Array<Contestant>,
	teams: Array<Team>,
): Promise<void> => {
	try {
		LoggingProvider.LogData(`Updating competition data for id = ${id}.`, { contestants, teams });
		const contents = await getCompData(id);
		if (contestants.length === 0 && contents.contestants.length !== 1) {
			LoggingProvider.LogWarning(
				"No contestants to update, skipping write operation",
			);
			return;
		}
		contents.contestants = [...contestants];
		contents.teams = [...teams];

		return await writeTextFile(`${id}.json`, JSON.stringify(contents), {
			baseDir: BaseDirectory.AppData,
		});
	} catch (error) {
		console.log(error);
		toast.error("Nie udało się zaktualizować zawodów");
		LoggingProvider.LogException(
			`Error during updating competition id = ${id}.`,
			error,
		);
	}
};

export const updateGeneralData = async (
	data: GeneralListsJson,
): Promise<void> => {
	try {
		LoggingProvider.LogData("Updating general data file.", data);
		return await writeTextFile("data.json", JSON.stringify(data), {
			baseDir: BaseDirectory.AppData,
		});
	} catch (error) {
		toast.error("Nie udało się zaktualizować danych");
		LoggingProvider.LogException(`Error during updating general json.`, error);
	}
};

export const updateCompConfig = async (
	id: string,
	configs: {
		platformConfig: PlatformConfig;
		timeConfig: TimeConfig;
		orderConfig: OrderConfig;
	},
): Promise<void> => {
	try {
		LoggingProvider.LogData("Updating settings.", configs);
		const data = await getGeneralData();

		const comp = data.competitions.find((x) => x.id === id);

		if (!comp) return;

		comp.platformConfig = configs.platformConfig;
		comp.timeConfig = configs.timeConfig;
		comp.orderConfig = configs.orderConfig;

		return updateGeneralData(data);
	} catch (error) {
		toast.error("Nie udało się zaktualizować danych");
		LoggingProvider.LogException("Failed to update settings.", error);
	}
};

export const createComp = async (
	comp: Omit<
		Competition,
		"id" | "platformConfig" | "timeConfig" | "orderConfig"
	>,
): Promise<string> => {
	try {
		const id = uuid();

		const contents = await getGeneralData();

		const compData = { ...DefaultCompetition, ...comp, id };

		LoggingProvider.LogData("Adding new competition.", compData);

		contents.competitions.push(compData);

		await updateGeneralData(contents);

		await generateEmptyCompFile(id, { ...DefaultCompetition, ...comp });

		return id;
	} catch (ex) {
		LoggingProvider.LogException("Error during adding new competition", ex);
		return "";
	}
};

const generateEmptyCompFile = async (
	id: string,
	comp: Omit<Competition, "id">,
) => {
	LoggingProvider.LogInfo(`Creating new file:${id}.json `);

	const compFile = await create(`${id}.json`, {
		baseDir: BaseDirectory.AppData,
	});

	const data: CompetitionJsonData = {
		contestants: [],
		name: comp.name,
		teams: [],
	};

	await compFile.write(new TextEncoder().encode(JSON.stringify(data)));
	await compFile.close();

	LoggingProvider.LogInfo(`File:${id}.json created`);
};

export const deleteComp = async (id: string): Promise<void> => {
	try {
		LoggingProvider.LogInfo(`Deleting competition Id = ${id}.`);
		const data = await getGeneralData();

		data.competitions = data.competitions.filter((x) => x.id !== id);

		return updateGeneralData(data);
	} catch (error) {
		toast.error("Nie udało się zaktualizować danych");
		LoggingProvider.LogException(
			`Error during removing of competition id = ${id}`,
			error,
		);
	}
};

export const deleteSummary = async (id: string): Promise<void> => {
	try {
		LoggingProvider.LogInfo(`Deleting series Id = ${id}.`);
		const data = await getGeneralData();

		data.series = data.series.filter((x) => x.id !== id);

		return updateGeneralData(data);
	} catch (error) {
		LoggingProvider.LogException(
			`Error during removing of serie id = ${id}`,
			error,
		);
		toast.error("Nie udało się zaktualizować danych");
	}
};
