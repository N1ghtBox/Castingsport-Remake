import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ResultRow } from "../ThlonResults";
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
    header: {
        borderTop: 'none',
    },
    bold: {
        fontWeight: 'bold',
    },
    col1: {
        width: '8%',
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
    data: ResultRow[],
    from: number,
    to: number,
    additionalColumns?: {
        headers: string[],
        rowRenderer: (row: ResultRow) => JSX.Element,
        sortData?: (a: ResultRow, b: ResultRow) => number;
    }
};

const ResultTable = ({ data, from, to }: ItemsTableProps) => {

    return (
        <View style={styles.table}>
            <View style={[styles.row, styles.bold, styles.header]}>
                <Text style={styles.col1}>Miejsce</Text>
                <Text style={styles.col2}>Nr. Startowy</Text>
                <Text style={styles.col2}>Imię i nazwisko</Text>
                <Text style={styles.col2}>Okręg</Text>
                {
                    ...Array.from({ length: to - from + 1 }, (_, i) => i + from).map((contestId) => (
                        <Text style={styles.col2} key={contestId}>K-{contestId}</Text>
                    ))
                }
                <Text style={styles.col2}>K {from}-{to}</Text>
            </View>
            {data.map((row, i) => (
                <View key={row.number} style={{ ...styles.row, borderBottom: i === data.length - 1 ? "1px solid black" : 'none' }} wrap={false}>
                    <Text style={{ ...styles.col1, ...styles.bold }}>{i + 1}</Text>
                    <Text style={styles.col2}>{row.number}</Text>
                    <Text style={styles.col2}>{row.name}</Text>
                    <Text style={styles.col2}>{row.club}</Text>
                </View>
            ))}
        </View>
    );
};

export default ResultTable;