import { Button } from '@/components/ui/button';
import usePDFActions from '@/hooks/use-pdf-actions';
import type Competition from '@/types/Competition';
import { ContestContext } from '@/types/ContestContext';
import type { Contestant } from '@/types/Contestant';
import { GetThlonResult, TakesPartInContests } from '@/utils/contestUtils';
import { getCompData, getCompetitionInfo, getCompetitionLogo } from '@/utils/jsonUtils';
import { Print } from '@mui/icons-material';
import { Document, Font, Image, Page, StyleSheet, Text, View, usePDF } from '@react-pdf/renderer';
import { ChevronLeft, Download } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { toast } from 'sonner';
import ResultTable from "./components/ResultTable";
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
}

export type ContestantWithThlonResult = Contestant & { place: number, total: number }

export default function ThlonResults() {
    const { competition, from, to } = useLoaderData() as { competition: string, from: number, to: number, contestId: string };
    const contest = React.useContext(ContestContext);
    const [results, setResults] = useState<ContestantWithThlonResult[]>([]);
    const [comp, setComp] = useState<Competition | null>(null);

    const navigate = useNavigate();
    const { printPDF, downloadPDF } = usePDFActions();

    useEffect(() => {

        async function fetchResults() {
            if (!competition) {
                console.error("Competition or Contest ID is not provided.");
                toast.error("Wystąpił błąd podczas ładowania wyników.");
                return [];
            }
            const comp = await getCompData(competition);

            console.log("Fetched contestants:", comp.contestants);

            const results = comp.contestants
                .filter(contestant =>
                    TakesPartInContests(contestant, from, to))
                .filter(contestant =>
                    contestant.category === contest.category)
                .map((contestant) => ({ ...contestant, total: GetThlonResult(contestant, from, to) }))
                .sort((a, b) => b.total - a.total)
                .map((contestant, index) => ({ ...contestant, place: index + 1 }))

            console.log(results)

            setResults(results)

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
    }, [competition, from, to, contest.category]);


    const [instance, updateInstance] = usePDF({ document: <ResultDocument comp={comp} category={contest.category || "Nieznane"} from={from} to={to} results={results} /> });

    useEffect(() => {
        updateInstance(<ResultDocument comp={comp} category={contest.category || "Nieznane"} from={from} to={to} results={results} />);
    }, [comp, contest.category, from, to, results, updateInstance]);

    return (<>
        <div className='w-full flex gap-5 items-center px-4 h-[8vh]'>
            <Button variant={"outline"} onClick={() => navigate(-2)} >
                <ChevronLeft /> Wróć
            </Button>
            <Button onClick={async () => await downloadPDF(instance.blob)}>
                <Download /> {instance.loading ? 'Ładowanie...' : 'Pobierz'}
            </Button>
            <Button onClick={async () => await printPDF(instance.blob)}>
                <Print /> Drukuj
            </Button>
        </div>
        {instance.loading && <p>Ładowanie wyników...</p>}
        {instance.error && <p>Error: {instance.error}</p>}

        {instance.url && (
            <div className='h-[92vh]'>
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

function ResultDocument({ comp, category, from, to, results }: { comp: Competition | null; category: string; from: number; to: number; results: ContestantWithThlonResult[]; }) {
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
                    <Text>{category}</Text>
                </View>
                <View style={{ flex: 0.35, textAlign: "center", marginRight: '5%' }}>
                    <Text style={{ fontSize: '1.5rem', borderBottom: '3px solid black', padding: '0px 10px', fontWeight: 'bold', paddingBottom: '2px' }}>Konkurencje {from}-{to}</Text>
                    <Text style={{ fontSize: '1.2rem', padding: '0px 10px', paddingBottom: '2px' }}>{to - from + 1}-bój</Text>

                </View>
            </View>
            <ResultTable data={results} from={from} to={to} />
        </Page>
    </Document>;
}
