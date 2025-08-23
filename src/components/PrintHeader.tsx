import { Image, Text, View } from "@react-pdf/renderer";
import moment from "moment";
import type React from "react";
import type Competition from "@/types/Competition";
import { getCompetitionLogo } from "@/utils/jsonUtils";

type Props = {
    comp: Omit<Competition, 'id'> | null;
};

const PrintHeader: React.FC<Props> = ({ comp }) => {
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
            <Image
                source={async () => await getCompetitionLogo(comp?.logoUrl)}
                style={{
                    maxHeight: "90%",
                    maxWidth: "20%",
                    marginLeft: "5%",
                    borderTopLeftRadius: "25%",
                    borderTopRightRadius: "25%",
                    borderBottomLeftRadius: "25%",
                    borderBottomRightRadius: "25%",
                }}></Image>
            <View style={{ flex: 0.95, textAlign: "center", marginRight: "5%" }}>
                <Text
                    style={{
                        fontSize: "2rem",
                        borderBottom: "3px solid black",
                        padding: "0px 30px",
                        fontWeight: "bold",
                    }}>
                    {comp?.name}
                </Text>
                <Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {comp?.place}, {moment(comp?.dateFrom).format("DD")}-
                    {moment(comp?.dateTo).format("LL")}
                </Text>
            </View>
        </View>
    );
};

export default PrintHeader;
