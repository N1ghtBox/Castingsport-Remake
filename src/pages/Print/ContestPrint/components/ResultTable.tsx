import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ResultRow } from "../ContestResults";
import useFinalsButton from "@/hooks/use-finals-button";
import { pdfStyle } from "@/utils/renderUtils";
import { TimeToSeconds } from "@/utils/convertUtils";
import { useMemo } from "react";
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
    lowerTitle: {
        marginTop: '10px'
    }
})

type ItemsTableProps = {
    data: ResultRow[],

    additionalColumns?: {
        headers: string[],
        rowRenderer: (row: ResultRow) => JSX.Element,
        sortData?: (a: ResultRow, b: ResultRow) => number;
    },
    finals: {
        finalCount: ReturnType<typeof useFinalsButton>["count"]
        finalResults: ReturnType<typeof useFinalsButton>["finalResults"],
        finalSorter?: (a: ResultRow, b: ResultRow) => number;
    }

};

const ResultTable = ({ data, additionalColumns, finals }: ItemsTableProps) => {
    const Finals = finals.finalResults?.finals

    const additionalStyles = Finals ? [styles.lowerTitle] : []

    const preparedData = useMemo(() => {
        if (!Finals) return data

        const sortedFinals = Finals.sort((a, b) => {
            const scoreA = a.result || 0;
            const scoreB = b.result || 0;

            const timeA = TimeToSeconds(a.time || "00.00.000");
            const timeB = TimeToSeconds(b.time || "00.00.000");
            return scoreB - scoreA || timeA - timeB;

        });

        const sortedData = sortedFinals
            .map(result => {
                const contestant = data.find(p => p.number === result.number);
                return contestant ? { ...contestant } as ResultRow : null;
            })
            .filter((p): p is ResultRow => p !== null);

        const finalIds = new Set(sortedData.map(r => r.number));
        return [...sortedData, ...data.filter(p => !finalIds.has(p.number))];
    }, [Finals, data])

    console.log(preparedData)

    return (
        <View style={styles.table}>
            <View style={[styles.row, styles.bold, styles.header]}>
                <Text style={[styles.col1, ...additionalStyles]}>Miejsce</Text>
                <Text style={[styles.col2, ...additionalStyles]}>Nr. Startowy</Text>
                <Text style={[styles.col2, ...additionalStyles]}>Imię i nazwisko</Text>
                <Text style={[styles.col2, ...additionalStyles]}>Okręg</Text>
                {additionalColumns?.headers.map((header) => (
                    <Text key={header} style={[styles.col4, ...additionalStyles]}>{header}</Text>
                ))}
                {
                    finals.finalResults && (
                        <View style={pdfStyle.DoubleColumn.Header.view}>
                            <Text>Finały</Text>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={pdfStyle.DoubleColumn.Header.text}>Rzut</Text>
                                <Text style={pdfStyle.DoubleColumn.Header.text}>Wynik</Text>
                            </View>
                        </View>
                    )
                }
            </View>
            {preparedData.map((row, i) => {
                return (
                    <View key={row.number} style={{
                        ...styles.row, borderBottom: i === data.length - 1 || (finals.finalCount && i + 1 === finals.finalCount)
                            ? "1px solid black" : '1px solid #d6d6d6'
                    }} wrap={false}>
                        <Text style={[styles.col1, styles.bold]}>{i + 1}</Text>
                        <Text style={styles.col2}>{row.number}</Text>
                        <Text style={styles.col2}>{row.name}</Text>
                        <Text style={styles.col2}>{row.club}</Text>
                        {additionalColumns?.rowRenderer(row)}
                        {
                            Finals && (
                                <View style={pdfStyle.DoubleColumn.Row.view}>
                                    <Text style={pdfStyle.DoubleColumn.Row.text}>{Finals.find(x => x.number === row.number)?.result}</Text>
                                    <Text style={pdfStyle.DoubleColumn.Row.text}>{Finals.find(x => x.number === row.number)?.time}</Text>
                                </View>
                            )
                        }
                    </View>
                )
            })}
        </View>
    );
};

export default ResultTable;        
