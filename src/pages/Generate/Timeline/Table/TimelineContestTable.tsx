import { ContestNames, type Contests } from "@/types/Contestant";
import type { TimelineContestant } from "@/types/TimelineData";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Moment } from "moment";
import { useMemo } from "react";

const styles = StyleSheet.create({
    table: {
        width: '100%',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 2,
        paddingBottom: 2,
    },
    marginTop: {
        marginTop: 10,
    },
    header: {
        borderTop: 'none',
    },
    bold: {
        fontWeight: 'bold',
    },
    col1: {
        textAlign: 'center',
    },
    eventTitle: {
        fontWeight: 'bold',
        fontSize: '1.5rem'
    },
})

type TimelineContestTableProps = {
    data: Record<number, TimelineContestant[]>
    startOfEvent: Moment,
    event: Contests
    club: string | undefined
}

const TimelineContestTable = ({ data, event, startOfEvent, club }: TimelineContestTableProps) => {

    const positionCount = Object.keys(data).length

    const rows: TimelineContestant[][] = useMemo(() => {
        const totalCount = Object.values(data).reduce((acc, item) => acc + item.length, 0)
        let index = 0;

        const rowCount = Math.ceil(totalCount / positionCount)

        const internalRows: TimelineContestant[][] = []

        while (index < (rowCount * positionCount + 1)) {
            const orderId = Math.floor(index / positionCount) + 1
            const platformId = index % positionCount + 1

            if (!internalRows[orderId - 1]) internalRows[orderId - 1] = []

            const contestant = data[platformId]?.at(orderId - 1)

            if (contestant) internalRows[orderId - 1].push(contestant)
            index++
        }

        return internalRows

    }, [data, positionCount])

    const columnWidth = 100 / positionCount

    return (
        <View style={{ paddingHorizontal: '2.5%', paddingVertical: '3%' }}>
            <Text style={[styles.eventTitle]}>K-{event} {ContestNames.get(event)} - {startOfEvent.format("DD MMM HH:mm")}</Text>
            <View style={styles.table}>
                <View style={[styles.row, styles.bold, styles.header]}>
                    {
                        Array.from({ length: positionCount }, (_, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <Text style={[styles.col1, styles.marginTop, { width: `${columnWidth}%` }]} key={i}>
                                Rzutnia {i + 1}
                            </Text>
                        ))
                    }
                </View>
                {rows.map((row, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <View key={i} style={[styles.row]} wrap={false}>
                        {
                            row.map((cell) => (
                                <Text
                                    key={cell.number}
                                    style={[{
                                        width: `${columnWidth}%`,
                                        marginHorizontal: columnWidth > 30 ? '10%' : '2px',
                                        backgroundColor: club === cell.club ? 'gray' : 'transparent'
                                    }]}>
                                    {cell.number} {cell.name}
                                </Text>
                            ))
                        }
                    </View>
                ))}
            </View>
        </View>
    );
};

export default TimelineContestTable;