import type Competition from '@/types/Competition';
import type CompetitionData from '@/types/CompetitionData';
import type { Contestant } from '@/types/Contestant';
import type GeneralDataJson from '@/types/GeneralDataJson';
import type Team from '@/types/Teams';
import { BaseDirectory, create, readFile, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid'

export const getGeneralData = async (): Promise<GeneralDataJson> => {
    try {
        const contents = await readTextFile('data.json', {
            baseDir: BaseDirectory.AppData,
        });

        return JSON.parse(contents)
    } catch (error) {
        console.log(error)
        toast.error("Nie udało się odczytać danych")
        return { competitions: [], series: [] }
    }
}

export const getCompetitionInfo = async (id: string): Promise<Competition | undefined> => {
    try {
        const contents = await getGeneralData();

        return contents.competitions.find(x => x.id === id);
    } catch (error) {
        console.log(error)
        toast.error("Nie udało się odczytać danych")
        return { id: "", name: "", place: "", dateFrom: new Date(), dateTo: new Date() }
    }
}

export const getCompetitionLogo = async (): Promise<string> => {
    try {
        const logo = await readFile('logos/logo.png', {
            baseDir: BaseDirectory.AppData
        })

        return URL.createObjectURL(new Blob([logo], { type: 'image/png' }));
    } catch (error) {
        console.log(error)
        toast.error("Nie można odczytać logo zawodów")
        return "";
    }
}

export const getCompData = async (id: string): Promise<CompetitionData> => {
    try {
        const contents = await readTextFile(`${id}.json`, {
            baseDir: BaseDirectory.AppData,
        });

        return JSON.parse(contents)
    } catch (error) {
        console.log(error)
        toast.error("Nie udało się odczytać zawodów")
        return { contestants: [], teams: [], name: "Brak danych" }
    }
}

export const updateCompData = async (id: string, contestants: Array<Contestant>, teams: Array<Team>): Promise<void> => {
    try {
        const contents = await getCompData(id);
        if (contestants.length === 0 && contents.contestants.length !== 1) {
            console.warn("No contestants to update, skipping write operation");
            return;
        }
        contents.contestants = [...contestants]
        contents.teams = [...teams]

        return await writeTextFile(`${id}.json`, JSON.stringify(contents), {
            baseDir: BaseDirectory.AppData,
        });

    } catch (error) {
        console.log(error)
        toast.error("Nie udało się zaktualizować zawodów")
    }
}

export const updateGeneralData = async (data: GeneralDataJson): Promise<void> => {
    try {
        return await writeTextFile('data.json', JSON.stringify(data), {
            baseDir: BaseDirectory.AppData,
        });
    } catch (error) {
        console.log(error)
        toast.error("Nie udało się zaktualizować danych")
    }
}

export const createComp = async (comp: Omit<Competition, 'id'>): Promise<string> => {
    const id = uuid()

    const contents = await getGeneralData();

    contents.competitions.push({ ...comp, id })

    await updateGeneralData(contents)

    await generateEmptyCompFile(id, comp)

    return id
}

const generateEmptyCompFile = async (id: string, comp: Omit<Competition, 'id'>) => {
    const compFile = await create(`${id}.json`, {
        baseDir: BaseDirectory.AppData,
    })

    const data: CompetitionData = { contestants: [], name: comp.name, teams: [] }

    await compFile.write(new TextEncoder().encode(JSON.stringify(data)))
    await compFile.close();
}