import { Text, View } from "@react-pdf/renderer";
import { Contests } from "@/types/Contestant";

type ContestPrintInfoProps = {
    category: string;
    contestId: Contests;
    contestName: string;
    contestLabel: string;
};

const ContestPrintInfo = ({ category, contestId, contestName, contestLabel }: ContestPrintInfoProps) => {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                height: "10vh",
                marginTop: "2.5vh",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
            <View
                style={{
                    marginLeft: "10%",
                    backgroundColor: "aqua",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    padding: "5px 20px",
                }}>
                <Text>{category}</Text>
            </View>
            <View style={{ flex: 0.35, textAlign: "center", marginRight: "5%" }}>
                <Text
                    style={{
                        fontSize: "1.5rem",
                        borderBottom: "3px solid black",
                        padding: "0px 10px",
                        fontWeight: "bold",
                        paddingBottom: "2px",
                    }}>
                    {contestLabel} {contestId}
                </Text>
                <Text
                    style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        paddingTop: "5px",
                    }}>
                    {contestName}
                </Text>
            </View>
        </View>
    );
};

export default ContestPrintInfo;
