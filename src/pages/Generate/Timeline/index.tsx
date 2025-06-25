import { CompetitonContext } from "@/CompetitionLayout";
import { Button } from "@/components/ui/button";
import usePDFActions from "@/hooks/use-pdf-actions";
import { generateTimelineForEvent } from "@/lib/timelineUtils";
import type Competition from "@/types/Competition";
import { Contests } from "@/types/Contestant";
import type { TimelineData } from "@/types/TimelineData";
import { getCompetitionLogo } from "@/utils/jsonUtils";
import { Print } from "@mui/icons-material";
import { Document, Image, Page, StyleSheet, Text, View, usePDF } from '@react-pdf/renderer';
import { ChevronLeft, Download } from "lucide-react";
import moment from "moment";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

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

const TimelineGenerate = () => {
    const navigate = useNavigate()
    const competitionContext = React.useContext(CompetitonContext);
    const { printPDF, downloadPDF } = usePDFActions();

    const timelineData = React.useMemo(() => {
        console.log(generateTimelineForEvent(competitionContext.contestants, Contests.FlySkish))
        console.log(generateTimelineForEvent(competitionContext.contestants, Contests.MultiSkish))
        return {}

    }, [competitionContext.contestants])

    const [instance, updateInstance] = usePDF({ document: <TimelineDocument comp={competitionContext.compInfo} data={timelineData} /> });

    useEffect(() => {
        updateInstance(<TimelineDocument comp={competitionContext.compInfo} data={timelineData} />);
    }, [competitionContext.compInfo, updateInstance, timelineData]);

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

export default TimelineGenerate

function TimelineDocument({ comp, data }: { comp: Partial<Competition>; data: TimelineData }) {
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

            {/* <TimelineContestTable data={data?.[1]} positionCount={4} /> */}
            {/* <TimelineContestTable data={data?.[3]} positionCount={4} /> */}
        </Page>
    </Document>;
}