import type Competition from '@/types/Competition';
import type CompetitionData from '@/types/CompetitionData';
import type { Contestant } from '@/types/Contestant';
import type GeneralDataJson from '@/types/GeneralDataJson';
import { BaseDirectory, create, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
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

export const getCompData = async (id: string): Promise<CompetitionData> => {
    try {
        const contents = await readTextFile(`${id}.json`, {
            baseDir: BaseDirectory.AppData,
        });

        return JSON.parse(contents)
    } catch (error) {
        console.log(error)
        toast.error("Nie udało się odczytać zawodów")
        return { contestants: [], name: "Brak danych" }
    }
}

export const updateCompData = async (id: string, contestants: Array<Contestant>): Promise<void> => {
    try {
        const contents = await getCompData(id);

        contents.contestants = [...contestants]

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

    const data: CompetitionData = { contestants: [], name: comp.name }

    await compFile.write(new TextEncoder().encode(JSON.stringify(data)))
    await compFile.close();
}