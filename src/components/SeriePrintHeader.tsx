import { Text, View } from "@react-pdf/renderer";
import type React from "react";
import type { Series } from "@/types/Series";

type Props = {
    serie: Series;
};

const SeriePrintHeader: React.FC<Props> = ({ serie }) => {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                height: "10vh",
                marginTop: "2vh",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
            <View style={{ flex: 1, textAlign: "center", marginHorizontal: "5%" }}>
                <Text
                    style={{
                        fontSize: "4rem",
                        borderBottom: "3px solid black",
                        padding: "0px 30px",
                        fontWeight: "bold",
                    }}>
                    {serie.name}
                </Text>
            </View>
        </View>
    );
};

export default SeriePrintHeader;
