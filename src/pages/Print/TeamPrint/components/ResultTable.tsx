import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ContestantWithThlonResult } from "../TeamResults";
import type { TeamContextProps } from "@/types/TeamsContext";
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

type ItemsTableProps = {
    data: TeamContextProps["teamResults"],
    additionalColumns?: {
        headers: string[],
        rowRenderer: (row: ContestantWithThlonResult) => JSX.Element,
        sortData?: (a: ContestantWithThlonResult, b: ContestantWithThlonResult) => number;
    }
};

const ResultTable = ({ data, }: ItemsTableProps) => {

    return (
        <View style={styles.table}>
            <View style={[styles.row, styles.bold, styles.header]}>
                <Text style={[styles.col1, styles.marginTop]} />
                <Text style={[styles.col1, styles.marginTop]}>Miejsce</Text>
                <Text style={[styles.col4, styles.marginTop]}>Nazwa</Text>
                <Text style={[styles.col4, styles.marginTop]}>Zawodnicy</Text>
                <Text style={[styles.col2, styles.marginTop]}>Razem</Text>
            </View>
            {data.map((row, i) => (
                <View key={row.id} style={{ ...styles.row, borderBottom: i === data.length - 1 ? "1px solid black" : '1px solid #d6d6d6' }} wrap={false}>
                    <Text style={{ ...styles.col1, ...styles.bold }} />
                    <View style={[styles.col1, styles.bold, { height: '100%', display: 'flex', justifyContent: 'center' }]}>
                        <Text>{row.place}</Text>
                    </View>
                    <View style={[styles.col4, { height: '100%', display: 'flex', justifyContent: 'center' }]}>
                        <Text>{row.name}</Text>
                    </View>
                    <View style={styles.col4}>
                        {row.members.map(member => {
                            return (
                                <View key={member.name} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>{member.name}</Text>
                                    <Text>{member.score} pkt</Text>
                                </View>
                            )
                        })}
                    </View>
                    <View style={[styles.col2, { height: '100%', display: 'flex', justifyContent: 'center' }]}>
                        <Text>{row.total.toFixed(2)} pkt</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default ResultTable;