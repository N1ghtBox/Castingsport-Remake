import { Button } from "@/components/ui/button";
import usePDFActions from "@/hooks/use-pdf-actions";
import { EVENT_ORDER, generateTimeline, generateTimelineWithConfigs } from "@/lib/timelineUtils";
import type Competition from "@/types/Competition";
import { Contests } from "@/types/Contestant";
import type { TimelineData } from "@/types/TimelineData";
import { getCompetitionLogo } from "@/utils/jsonUtils";
import { Print } from "@mui/icons-material";
import { Document, Image, Page, StyleSheet, Text, View, usePDF } from '@react-pdf/renderer';
import { ChevronLeft, Download } from "lucide-react";
import moment, { type Moment } from "moment";
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import TimelineContestTable from "./Table/TimelineContestTable";
import OverwriteSettings from "./OverwriteSettings/OverwriteSettings";
import { CompetitonContext } from "@/types/CompetitionContext";

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'transparent',
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

        const generateTimelineForEvent = generateTimelineWithConfigs(competitionContext.compInfo.platformConfig)

        const data = {
            [Contests.FlySkish]: generateTimelineForEvent(competitionContext.contestants, Contests.FlySkish),
            [Contests.FlyDistance]: generateTimelineForEvent(competitionContext.contestants, Contests.FlyDistance),
            [Contests.Arenberg]: generateTimelineForEvent(competitionContext.contestants, Contests.Arenberg),
            [Contests.Skish]: generateTimelineForEvent(competitionContext.contestants, Contests.Skish),
            [Contests.Distance]: generateTimelineForEvent(competitionContext.contestants, Contests.Distance),
            [Contests.FlyDistanceDoubleHand]: generateTimelineForEvent(competitionContext.contestants, Contests.FlyDistanceDoubleHand),
            [Contests.DistanceDoubleHand]: generateTimelineForEvent(competitionContext.contestants, Contests.DistanceDoubleHand),
            [Contests.MultiSkish]: generateTimelineForEvent(competitionContext.contestants, Contests.MultiSkish),
            [Contests.MultiDistance]: generateTimelineForEvent(competitionContext.contestants, Contests.MultiDistance),
        } as TimelineData

        return data
    }, [competitionContext.contestants, competitionContext.compInfo.platformConfig])

    const timeline = useMemo(() => {
        const startDate = moment(competitionContext.compInfo.dateFrom)

        return generateTimeline(startDate, timelineData, competitionContext.compInfo.timeConfig)
    }, [timelineData, competitionContext.compInfo.timeConfig, competitionContext.compInfo.dateFrom])

    const [instance, updateInstance] = usePDF({
        document: <TimelineDocument
            comp={competitionContext.compInfo}
            data={timelineData}
            timeline={timeline} />
    });

    useEffect(() => {
        updateInstance(<TimelineDocument comp={competitionContext.compInfo} data={timelineData} timeline={timeline} />);
    }, [competitionContext.compInfo, updateInstance, timelineData, timeline]);

    return (<>
        <div className='w-full flex gap-5 items-center px-4 h-[8vh]'>
            <Button variant={"outline"} onClick={() => navigate('..')} >
                <ChevronLeft /> Wróć
            </Button>
            <Button onClick={async () => await downloadPDF(instance.blob, `Rozpiska-${competitionContext.compInfo.name}.pdf`)}>
                <Download /> {instance.loading ? 'Ładowanie...' : 'Pobierz'}
            </Button>
            <Button onClick={async () => await printPDF(instance.blob)}>
                <Print /> Drukuj
            </Button>
            <OverwriteSettings />
        </div>
        {instance.loading && <p>Generowanie rozpiski...</p>}
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

type DocumentProps = {
    comp: Partial<Competition>;
    data: TimelineData,
    timeline: Partial<Record<Contests, Moment>>
}

function TimelineDocument({ comp, data, timeline }: DocumentProps) {
    return <Document title='Contest Results' creator='Castingsport Dawid Witczak'>
        <Page size="A4" style={styles.page}>
            <View style={{ display: 'flex', flexDirection: 'row', height: '10vh', marginTop: '2.5vh', alignItems: 'center', justifyContent: 'space-between' }}>
                <Image source={async () => await getCompetitionLogo()} style={{
                    maxHeight: '90%',
                    maxWidth: '20%',
                    marginLeft: '5%',
                    borderTopLeftRadius: '25%',
                    borderTopRightRadius: '25%',
                    borderBottomLeftRadius: '25%',
                    borderBottomRightRadius: '25%',
                }}>

                </Image>
                <View style={{ flex: 0.95, textAlign: "center", marginRight: '5%' }}>
                    <Text style={{ fontSize: '2rem', borderBottom: '3px solid black', padding: '0px 30px', fontWeight: 'bold' }}>{comp?.name}</Text>
                    <Text style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{comp?.place}, {moment(comp?.dateFrom).format('DD')}-{moment(comp?.dateTo).format('LL')}</Text>
                </View>
            </View>

            {
                Array.from(EVENT_ORDER.slice(0, 3)).map(x => {
                    return (
                        Object.keys(data[x]).length !== 0 &&
                        < TimelineContestTable data={data[x]} key={x} startOfEvent={timeline[x] || moment()} event={x} />
                    )
                })
            }
        </Page>
        <Page size="A4" style={styles.page}>
            {
                Array.from(EVENT_ORDER.slice(3, 5)).map(x => {
                    return (
                        Object.keys(data[x]).length !== 0 &&
                        < TimelineContestTable data={data[x]} key={x} startOfEvent={timeline[x] || moment()} event={x} />
                    )
                })
            }
        </Page>
        <Page size="A4" style={styles.page}>
            {
                Array.from(EVENT_ORDER.slice(5, 7)).map(x => {
                    return (
                        Object.keys(data[x]).length !== 0 &&
                        < TimelineContestTable data={data[x]} key={x} startOfEvent={timeline[x] || moment()} event={x} />
                    )
                })
            }
        </Page>
        <Page size="A4" style={styles.page}>
            {
                Array.from(EVENT_ORDER.slice(7, 9)).map(x => {
                    return (
                        Object.keys(data[x]).length !== 0 &&
                        < TimelineContestTable data={data[x]} key={x} startOfEvent={timeline[x] || moment()} event={x} />
                    )
                })
            }
        </Page>
    </Document>;
}