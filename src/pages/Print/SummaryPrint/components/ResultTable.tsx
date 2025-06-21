import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ContestantWithThlonResult } from "../ThlonResults";
import { RenderContestHeaderInPdf, RenderContestScoreInPdf } from "@/utils/renderUtils";
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
                        RenderContestHeaderInPdf(contestId)
                    ))
                }
                <Text style={[styles.col2, styles.marginTop]}>K {from}-{to}</Text>
            </View>
            {data.map((row, i) => (
                <View key={row.number} style={{ ...styles.row, borderBottom: i === data.length - 1 ? "1px solid black" : '1px solid #d6d6d6' }} wrap={false}>
                    <Text style={{ ...styles.col1, ...styles.bold }}>{row.place}</Text>
                    <Text style={styles.col2}>{row.name}</Text>
                    <Text style={styles.col2}>{row.club}</Text>
                    {
                        ...Array.from({ length: to - from + 1 }, (_, i) => i + from).map((contestId) => (
                            RenderContestScoreInPdf(contestId, row)
                        ))
                    }
                    <Text style={styles.col2}>{row.total.toFixed(2)}</Text>
                </View>
            ))}
        </View>
    );
};

export default ResultTable;