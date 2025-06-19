import { RenderContestScoreInPdf } from "@/utils/contestUtils";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ContestantWithThlonResult } from "../ThlonResults";
const styles = StyleSheet.create({
    table: {
        width: '100%',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 8,
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
        width: '20%',
        textAlign: 'center',
    },
    col5: {
        width: '10%',
        textAlign: 'center',
    },
})

type ItemsTableProps = {
    data: ContestantWithThlonResult[],
    from: number,
    to: number,
    additionalColumns?: {
        headers: string[],
        rowRenderer: (row: ContestantWithThlonResult) => JSX.Element,
        sortData?: (a: ContestantWithThlonResult, b: ContestantWithThlonResult) => number;
    }
};

const ResultTable = ({ data, from, to }: ItemsTableProps) => {

    return (
        <View style={styles.table}>
            <View style={[styles.row, styles.bold, styles.header]}>
                <Text style={[styles.col1, styles.marginTop]}>Miejsce</Text>
                <Text style={[styles.col2, styles.marginTop]}>Imię i nazwisko</Text>
                <Text style={[styles.col2, styles.marginTop]}>Okręg</Text>
                {
                    ...Array.from({ length: to - from + 1 }, (_, i) => i + from).map((contestId) => (
                        <>
                            <View style={{ ...styles.col2, display: 'flex', flexDirection: 'column', alignItems: 'center' }} key={contestId}>
                                <Text>K-{contestId}</Text>

                            </View>
                        </>

                    ))
                }
                <Text style={[styles.col2, styles.marginTop]}>K {from}-{to}</Text>
            </View>
            {data.map((row, i) => (
                <View key={row.number} style={{ ...styles.row, borderBottom: i === data.length - 1 ? "1px solid black" : 'none' }} wrap={false}>
                    <Text style={{ ...styles.col1, ...styles.bold }}>{row.place}</Text>
                    <Text style={styles.col1}>{row.name}</Text>
                    <Text style={styles.col1}>{row.club}</Text>
                    {
                        ...Array.from({ length: to - from + 1 }, (_, i) => i + from).map((contestId) => (
                            <Text style={styles.col2} key={contestId}>{RenderContestScoreInPdf(contestId, row)}</Text>
                        ))
                    }
                    <Text style={styles.col2}>{row.total.toFixed(2)}</Text>
                </View>
            ))}
        </View>
    );
};

export default ResultTable;