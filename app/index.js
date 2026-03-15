import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useWorkout } from "../context/WorkoutContext";

export default function Home() {

    const router = useRouter();
    const { archiveProgram } = useWorkout();

    const Card = ({ title, icon, route }) => (
        <Pressable
            style={styles.card}
            onPress={() => router.push(route)}
        >
            <MaterialIcons name={icon} size={36} color="white" />
            <Text style={styles.cardText}>{title}</Text>
        </Pressable>
    );

    return (

        <View style={styles.container}>

            <Text style={styles.title}>Gym App</Text>

            <View style={styles.grid}>

                <Card
                    title="Sesión A"
                    icon="fitness-center"
                    route="/session?type=A"
                />

                <Card
                    title="Sesión B"
                    icon="fitness-center"
                    route="/session?type=B"
                />

                <Card
                    title="Sesión C"
                    icon="fitness-center"
                    route="/session?type=C"
                />

               

                <Card
                    title="Historial"
                    icon="history"
                    route="/history"
                />

            </View>

            <Pressable
                style={styles.archiveButton}
                onPress={archiveProgram}
            >
                <MaterialIcons name="archive" size={20} color="white" />
                <Text style={styles.archiveText}>
                    Guardar programa
                </Text>
            </Pressable>

        </View>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#111",
        paddingTop: 80,
        alignItems: "center"
    },

    title: {
        color: "white",
        fontSize: 30,
        marginBottom: 40
    },

    grid: {
        width: "90%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },

    card: {
        width: "47%",
        backgroundColor: "#222",
        padding: 30,
        borderRadius: 14,
        alignItems: "center",
        marginBottom: 16
    },

    cardText: {
        color: "white",
        marginTop: 10,
        fontSize: 16
    },

    archiveButton: {
        marginTop: 30,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#333",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10
    },

    archiveText: {
        color: "white",
        fontSize: 15
    }

});