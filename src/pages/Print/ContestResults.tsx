import { Button } from '@/components/ui/button';
import type Competition from '@/types/Competition';
import { Categories, type Contest, ContestNames, Contests } from '@/types/Contestant';
import { TimeToSeconds } from '@/utils/convertUtils';
import { getCompData, getCompetitionInfo, getCompetitionLogo } from '@/utils/jsonUtils';
import { Print } from '@mui/icons-material';
import { Document, Font, Image, Page, StyleSheet, Text, View, usePDF } from '@react-pdf/renderer';
import { ChevronLeft, Download } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import ResultTable from "./components/ResultTable";
import usePDFActions from '@/hooks/use-pdf-actions';
Font.registerHyphenationCallback((word) => [word]);
// Register Font
Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
            fontWeight: 'normal',
        },
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
            fontWeight: 'bold',
        },
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
            fontStyle: 'italic',
        }
    ]
});

type AdditionalProps = {
    headers: string[];
    rowRenderer: (row: ResultRow) => JSX.Element;
    sortData: (a: ResultRow, b: ResultRow) => number;
} | undefined

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#E4E4E4',
        width: '100%',
        fontSize: 8,
        fontFamily: "Roboto"
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});

export type ResultRow = {
    number: string;
    name: string;
    club: string;
    category: string;
    contestData: Contest;
}

export default function ContestResults() {
    const { competition, contestId } = useLoaderData() as { competition: string, contestId: string };
    const [query] = useSearchParams({ category: Categories.Unknown });
    const [results, setResults] = useState<ResultRow[]>([]);
    const [comp, setComp] = useState<Competition | null>(null);
    const navigate = useNavigate();
    const {printPDF, downloadPDF} = usePDFActions();

    useEffect(() => {

        async function fetchResults() {
            if (!competition || !contestId) {
                console.error("Competition or Contest ID is not provided.");
                toast.error("Wystąpił błąd podczas ładowania wyników.");
                return [];
            }
            const comp = await getCompData(competition);

            console.log("Fetched contestants:", comp);

            if (!comp || comp.contestants.length === 0) {
                console.error("No contestants found for the given competition.");
                toast.error("Brak zawodników w tej konkurencji.");
                return [];
            }
            const filteredContestants = comp.contestants.filter(c => c.category === query.get('category'));

            const results: ResultRow[] = filteredContestants.map((contestant) => {
                const result = contestant.contests.find(r => r.id === Number.parseInt(contestId) && r.takesPart);

                if (result === undefined) {
                    console.warn(`No result found for contestant ${contestant.name} in contest ${contestId}`);
                    return null;
                }

                return {
                    name: contestant.name,
                    number: contestant.number.toString(),
                    club: contestant.club,
                    category: contestant.category,
                    contestData: result,
                } as ResultRow
            })
                .filter((row => row !== null));

            setResults(results);
        }
        fetchResults()

        async function fetchCompetitionData() {
            if (!competition) {
                console.error("Competition is not provided.");
                toast.error("Wystąpił błąd podczas ładowania danych konkurencji.");
                return;
            }
            const comp = await getCompetitionInfo(competition);


            console.log("Fetched competition data:", comp);

            if (!comp) {
                console.error("No competition data found.");
                toast.error("Brak danych zawodów.");
                return;
            }

            setComp(comp);
        }
        fetchCompetitionData();
    }, [competition, contestId, query]);

    const additionalColumns = useMemo(() => {
        const contestIdInt = Number.parseInt(contestId);

        if (contestIdInt === Contests.Arenberg
            || contestIdInt === Contests.Skish
            || contestIdInt === Contests.FlySkish
        ) {
            return {
                headers: ["Wynik", "Czas"],
                rowRenderer: (row: ResultRow) => (
                    <>
                        <Text style={{ width: '20%', textAlign: 'center' }}>{row.contestData.score}</Text>
                        <Text style={{ width: '20%', textAlign: 'center' }}>{row.contestData.time}</Text>
                    </>
                ),
                sortData: (a: ResultRow, b: ResultRow) => {
                    const scoreA = a.contestData.score || 0;
                    const scoreB = b.contestData.score || 0;

                    const timeA = TimeToSeconds(a.contestData.time || "00.00.000");
                    const timeB = TimeToSeconds(b.contestData.time || "00.00.000");

                    return scoreB - scoreA || timeA - timeB;
                }
            }
        }

        if (contestIdInt === Contests.FlyDistance
            || contestIdInt === Contests.FlyDistanceDoubleHand
        ) {
            return {
                headers: ["Rzut 1", "Rzut 2", "Razem"],
                rowRenderer: (row: ResultRow) => (
                    <>
                        <Text style={{ width: '20%', textAlign: 'center' }}>{row.contestData.score}</Text>
                        <Text style={{ width: '20%', textAlign: 'center' }}>{row.contestData.second_score || 0}</Text>
                        <Text style={{ width: '20%', textAlign: 'center' }}>{row.contestData.score + (row.contestData.second_score || 0)}</Text>
                    </>
                ),
                sortData: (a: ResultRow, b: ResultRow) => {
                    const scoreA = a.contestData.score || 0;
                    const scoreB = b.contestData.score || 0;
                    const secondScoreA = a.contestData.second_score || 0;
                    const secondScoreB = b.contestData.second_score || 0;

                    return (scoreB + secondScoreB) - (scoreA + secondScoreA);
                }
            }
        }

        if (contestIdInt === Contests.Distance
            || contestIdInt === Contests.DistanceDoubleHand
            || contestIdInt === Contests.MultiDistance
        ) {
            return {
                headers: ["Rzut", "Wynik"],
                rowRenderer: (row: ResultRow) => (
                    <>
                        <Text style={{ width: '20%', textAlign: 'center' }}>{row.contestData.score}</Text>
                        <Text style={{ width: '20%', textAlign: 'center' }}>{row.contestData.score * 1.5}</Text>
                    </>
                ),
                sortData: (a: ResultRow, b: ResultRow) => {
                    const scoreA = a.contestData.score || 0;
                    const scoreB = b.contestData.score || 0;

                    return scoreB * 1.5 - scoreA * 1.5;
                }
            }
        }

    }, [contestId])

    const [instance, updateInstance] = usePDF({ document: <ResultDocument comp={comp} query={query} contestId={contestId} results={results} additionalColumns={additionalColumns} /> })

    React.useEffect(() => {
        updateInstance(<ResultDocument comp={comp} query={query} contestId={contestId} results={results} additionalColumns={additionalColumns} />);
    }, [comp, query, contestId, results, additionalColumns, updateInstance]);


    return (<>
        <div className='w-full flex gap-5 items-center p-4'>
            <Button variant={"outline"} onClick={() => navigate(`/competition/${competition}/contest/${contestId}?category=${query.get('category')}`)} >
                <ChevronLeft /> Wróć
            </Button>
            <Button onClick={async () => await downloadPDF(instance.blob)}>
                <Download /> {instance.loading ? 'Ładowanie...' : 'Pobierz'}
            </Button>
            <Button onClick={async () => await printPDF(instance.blob)}>
                <Print /> Drukuj
            </Button>
        </div>
        <div style={{ margin: '10px 0' }}>
            {instance.loading && <p>Loading PDF...</p>}
            {instance.error && <p>Error: {instance.error}</p>}
        </div>

        {instance.url && (
            <div className='h-[90vh]'>
                {/* Display PDF in iframe */}
                <iframe
                    src={instance.url}
                    width="100%"
                    height="100%"
                    title="PDF Preview"

                />
            </div>
        )}
    </>)
}

function ResultDocument({ comp, query, contestId, results, additionalColumns }: { comp: Competition | null; query: URLSearchParams; contestId: string; results: ResultRow[]; additionalColumns: AdditionalProps; }) {
    return <Document title='Contest Results' creator='Castingsport Dawid Witczak'>
        <Page size="A4" style={styles.page}>
            <View style={{ display: 'flex', flexDirection: 'row', height: '10vh', marginTop: '2.5vh', alignItems: 'center', justifyContent: 'space-between' }}>
                <Image source={async () => await getCompetitionLogo()} style={{
                    maxHeight: '90%',
                    marginLeft: '5%',
                    borderTopLeftRadius: '25%',
                    borderTopRightRadius: '25%',
                    borderBottomLeftRadius: '25%',
                    borderBottomRightRadius: '25%',
                }}>

                </Image>
                <View style={{ flex: 0.95, textAlign: "center", marginRight: '5%' }}>
                    <Text style={{ fontSize: '2rem', borderBottom: '3px solid black', padding: '0px 30px', fontWeight: 'bold' }}>{comp?.name}</Text>
                    <Text style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{comp?.place}, {moment(comp?.dateFrom).day()}-{moment(comp?.dateTo).format('LL')}</Text>
                </View>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', height: '10vh', marginTop: '2.5vh', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{
                    marginLeft: '10%',
                    backgroundColor: 'aqua',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    padding: '5px 20px',
                }}>
                    <Text>{query.get('category')}</Text>
                </View>
                <View style={{ flex: 0.35, textAlign: "center", marginRight: '5%' }}>
                    <Text style={{ fontSize: '1.5rem', borderBottom: '3px solid black', padding: '0px 10px', fontWeight: 'bold', paddingBottom: '2px' }}>Konkurencja {contestId}</Text>
                    <Text style={{ fontSize: '1.2rem', fontWeight: 'bold', paddingTop: '5px' }}>{ContestNames.get(Number.parseInt(contestId))}</Text>
                </View>
            </View>
            <ResultTable data={results} additionalColumns={additionalColumns} />
        </Page>
    </Document>;
}
