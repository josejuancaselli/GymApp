import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { db } from "../firebase";

export default function Program() {

    const { id } = useLocalSearchParams();

    const [program, setProgram] = useState(null);

    useEffect(() => {

        const fetchProgram = async () => {

            try {

                const ref = doc(db, "programHistory", id);
                const snap = await getDoc(ref);

                if (snap.exists()) {

                    setProgram(snap.data());

                }

            } catch (err) {

                console.log("Error cargando programa:", err);

            }

        };

        fetchProgram();

    }, []);

    if (!program) {

        return (
            <View style={styles.container}>
                <Text style={{ color: "white" }}>Cargando...</Text>
            </View>
        );

    }

    const renderSession = (title, exercises) => (

        <View style={styles.session}>

            <Text style={styles.sessionTitle}>
                Sesión {title}
            </Text>

            {exercises.map(ex => (

                <View key={ex.id} style={styles.exerciseCard}>

                    <Text style={styles.exerciseName}>
                        {ex.name}
                    </Text>

                    <Text style={styles.exerciseInfo}>
                        {ex.currentWeight} kg
                        {"  "}
                        {ex.currentSeries} x {ex.currentReps}
                    </Text>

                </View>

            ))}

        </View>

    );

    return (

        <ScrollView style={styles.container}>

            <Text style={styles.title}>
                {new Date(program.date).toLocaleDateString("es-AR")}
            </Text>

            {renderSession("A", program.sessions.A)}
            {renderSession("B", program.sessions.B)}
            {renderSession("C", program.sessions.C)}

        </ScrollView>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#111",
        padding: 20
    },

    title: {
        color: "white",
        fontSize: 26,
        textAlign: "center",
        marginBottom: 20
    },

    session: {
        marginBottom: 25
    },

    sessionTitle: {
        color: "#00d4ff",
        fontSize: 20,
        marginBottom: 10
    },

    exerciseCard: {
        backgroundColor: "#222",
        padding: 14,
        borderRadius: 10,
        marginBottom: 8
    },

    exerciseName: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },

    exerciseInfo: {
        color: "#aaa",
        marginTop: 4
    }

});