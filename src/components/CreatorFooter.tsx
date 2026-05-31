import { Text, View } from "@react-pdf/renderer";

const CreatorFooter = () => (
    <View
        style={{
            alignItems: "center",
            paddingBottom: "4px",
        }}>
        <Text style={{ fontSize: ".7rem", opacity: 0.4 }}>
            Wyniki dostarczone przez Dawid Witczak
        </Text>
    </View>
);

export default CreatorFooter;
