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
import type Competition from "@/types/Competition";
import { DefaultCompetition } from "@/types/CompetitionContext";
import type CompetitionData from "@/types/CompetitionData";
import type { Contestant } from "@/types/Contestant";
import type GeneralDataJson from "@/types/GeneralDataJson";
import type PlatformConfig from "@/types/PlatformConfig";
import type Team from "@/types/Teams";
import type TimeConfig from "@/types/TimeConfig";

export const getGeneralData = async (): Promise<GeneralDataJson> => {
	try {
		const contents = await readTextFile("data.json", {
			baseDir: BaseDirectory.AppData,
		});

		return JSON.parse(contents);
	} catch (error) {
		console.log(error);
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
		console.log(error);
		toast.error("Nie udało się odczytać danych");
		return DefaultCompetition;
	}
};

export const saveCompetitionLogo = async (
	array: Uint8Array,
	fileName: string,
): Promise<string> => {
	try {
		const imagePath = `logos/${fileName}`;

		await writeFile(imagePath, array, {
			baseDir: BaseDirectory.AppData,
		});

		return imagePath;
	} catch (error) {
		console.log(error);
		toast.error("Nie można odczytać logo zawodów");
		return "";
	}
};

export const getCompetitionLogo = async (path?: string): Promise<string> => {
	try {
		if (!path) return "";

		const logo = await readFile(path, {
			baseDir: BaseDirectory.AppData,
		});

		return URL.createObjectURL(new Blob([logo], { type: "image/png" }));
	} catch (error) {
		console.log(error);
		toast.error("Nie można odczytać logo zawodów");
		return "";
	}
};

export const getCompData = async (id: string): Promise<CompetitionData> => {
	try {
		const contents = await readTextFile(`${id}.json`, {
			baseDir: BaseDirectory.AppData,
		});

		return JSON.parse(contents);
	} catch (error) {
		console.log(error);
		toast.error("Nie udało się odczytać zawodów");
		return { contestants: [], teams: [], name: "Brak danych" };
	}
};

export const updateCompInfo = async (
	id: string,
	compInfo: Omit<Competition, 'id' | 'platformConfig' | 'timeConfig'>
): Promise<void> => {
	try {
		const contents = await getGeneralData();

		const comp = contents.competitions.find((x) => x.id === id);

		if (!comp) {
			toast.error("Nie udało się zaktualizować zawodów");
			return
		}

		comp.dateFrom = compInfo.dateFrom
		comp.dateTo = compInfo.dateTo
		comp.mainJudge = compInfo.mainJudge
		comp.secondaryJudge = compInfo.secondaryJudge
		comp.logoUrl = compInfo.logoUrl
		comp.name = compInfo.name
		comp.place = compInfo.place

		return await updateGeneralData(contents)

	} catch (error) {
		console.log(error);
		toast.error("Nie udało się zaktualizować zawodów");
	}
};

export const updateCompData = async (
	id: string,
	contestants: Array<Contestant>,
	teams: Array<Team>,
): Promise<void> => {
	try {
		const contents = await getCompData(id);
		if (contestants.length === 0 && contents.contestants.length !== 1) {
			console.warn("No contestants to update, skipping write operation");
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
	}
};

export const updateGeneralData = async (
	data: GeneralDataJson,
): Promise<void> => {
	try {
		return await writeTextFile("data.json", JSON.stringify(data), {
			baseDir: BaseDirectory.AppData,
		});
	} catch (error) {
		console.log(error);
		toast.error("Nie udało się zaktualizować danych");
	}
};

export const updateCompConfig = async (
	id: string,
	configs: { platformConfig: PlatformConfig; timeConfig: TimeConfig },
): Promise<void> => {
	try {
		const data = await getGeneralData();

		const comp = data.competitions.find((x) => x.id === id);

		if (!comp) return;

		comp.platformConfig = configs.platformConfig;
		comp.timeConfig = configs.timeConfig;

		return updateGeneralData(data);
	} catch (error) {
		console.log(error);
		toast.error("Nie udało się zaktualizować danych");
	}
};

export const createComp = async (
	comp: Omit<Competition, "id" | "platformConfig" | "timeConfig">,
): Promise<string> => {
	const id = uuid();

	const contents = await getGeneralData();

	contents.competitions.push({ ...DefaultCompetition, ...comp, id });

	await updateGeneralData(contents);

	await generateEmptyCompFile(id, { ...DefaultCompetition, ...comp });

	return id;
};

const generateEmptyCompFile = async (
	id: string,
	comp: Omit<Competition, "id">,
) => {
	const compFile = await create(`${id}.json`, {
		baseDir: BaseDirectory.AppData,
	});

	const data: CompetitionData = { contestants: [], name: comp.name, teams: [] };

	await compFile.write(new TextEncoder().encode(JSON.stringify(data)));
	await compFile.close();
};

export const deleteComp = async (id: string): Promise<void> => {
	try {
		const data = await getGeneralData();

		data.competitions = data.competitions.filter((x) => x.id !== id);

		console.log(id, data.competitions);

		return updateGeneralData(data);
	} catch (error) {
		console.log(error);
		toast.error("Nie udało się zaktualizować danych");
	}
};
