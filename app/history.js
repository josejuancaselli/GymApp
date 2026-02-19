import { StyleSheet, Text, View } from "react-native";

export default function Session() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontSize: 22,
    },
});
