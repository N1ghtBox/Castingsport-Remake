import { Text, View } from "@react-pdf/renderer";
import type { TeamContextProps } from "@/context/team/TeamContext.types";
import { pdfT } from "@/i18n/pdfLang";

type PrintTitleProps = {
    category: TeamContextProps["category"];
};

export default function PrintTitle({ category }: PrintTitleProps) {
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
                <Text>
                    {pdfT("nav.teams")} - {pdfT(`teamCategory.${category}`, { defaultValue: category })}
                </Text>
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
                    {pdfT("nav.contests")} {category === "Młodzieży" ? "3-5" : "1-5"}
                </Text>
                <Text
                    style={{
                        fontSize: "1.2rem",
                        padding: "0px 10px",
                        paddingBottom: "2px",
                    }}>
                    {pdfT("thlon.n", { n: category === "Młodzieży" ? 3 : 5 })}
                </Text>
            </View>
        </View>
    );
}
