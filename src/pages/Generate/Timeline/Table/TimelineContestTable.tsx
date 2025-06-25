import type { TimelineContestant } from "@/types/TimelineData";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { useMemo } from "react";

const styles = StyleSheet.create({
    table: {
        width: '100%',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 6,
        paddingBottom: 6,
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
        width: '10%',
        textAlign: 'center',
    },
    col2: {
        width: '20%',
        textAlign: 'center',
    },
    col3: {
        width: '15%',
        textAlign: 'center',
    },
    col4: {
        width: '25%',
        textAlign: 'center',
    },
    col5: {
        width: '10%',
        textAlign: 'center',
    },
})

type TimelineContestTableProps = {
    data: TimelineContestant[]
    positionCount: number
}

const TimelineContestTable = ({ data, positionCount }: TimelineContestTableProps) => {

    const rows: string[][] = useMemo(() => {
        console.log(data)


        return []
    }, [data])

    return (
        <View style={styles.table}>
            <View style={[styles.row, styles.bold, styles.header]}>
                {
                    Array.from({ length: positionCount }, (_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <Text style={[styles.col1, styles.marginTop]} key={i}>
                            Rzutnia {i + 1}
                        </Text>
                    ))
                }
            </View>
            {rows.map((row, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <View key={i} style={{ ...styles.row }} wrap={false}>
                    {
                        row.map((cell) => (
                            <Text key={cell} style={styles.col1}>{cell}</Text>
                        ))
                    }
                </View>
            ))}
        </View>
    );
};

export default TimelineContestTable;