import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Home() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gym App</Text>

            <Pressable
                style={styles.button}
                onPress={() => router.push("/session?type=A")}
            >
                <Text style={styles.buttonText}>Session A</Text>
            </Pressable>

            <Pressable
                style={styles.button}
                onPress={() => router.push("/session?type=B")}
            >
                <Text style={styles.buttonText}>Session B</Text>
            </Pressable>

            <Pressable
                style={styles.button}
                onPress={() => router.push("/session?type=C")}
            >
                <Text style={styles.buttonText}>Session C</Text>
            </Pressable>

            <Pressable
                style={styles.button}
                onPress={() => router.push("/history")}
            >
                <Text style={styles.buttonText}>History</Text>
            </Pressable>

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
        fontSize: 28,
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#333",
        padding: 15,
        marginVertical: 10,
        width: 200,
        alignItems: "center",
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});
