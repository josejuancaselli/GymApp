import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { db } from "../firebase";

export default function History() {

    const [programs, setPrograms] = useState([]);
    const router = useRouter();

    useEffect(() => {

        const fetchPrograms = async () => {

            try {

                const snap = await getDocs(collection(db, "programHistory"));

                const data = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setPrograms(data);

            } catch (err) {

                console.log("Error cargando historial:", err);

            }

        };

        fetchPrograms();

    }, []);

    const handleDelete = async (id) => {

        try {

            await deleteDoc(doc(db, "programHistory", id));

            setPrograms(prev => prev.filter(p => p.id !== id));

        } catch (err) {

            console.log("Error borrando programa:", err);

        }

    };

    return (

        <View style={styles.container}>

            <Text style={styles.title}>Historial</Text>

            <ScrollView>

                {programs.map(program => {

                    const totalExercises =
                        program.sessions.A.length +
                        program.sessions.B.length +
                        program.sessions.C.length;

                    return (

                        <View key={program.id} style={styles.wrapper}>

                            <Swipeable
                                renderRightActions={() => (
                                    <Pressable
                                        onPress={() => handleDelete(program.id)}
                                        style={styles.deleteButton}
                                    >
                                        <MaterialIcons name="delete" size={28} color="white" />
                                    </Pressable>
                                )}
                            >

                                <Pressable
                                    style={styles.card}
                                    onPress={() =>
                                        router.push(`/program?id=${program.id}`)
                                    }
                                >

                                    <Text style={styles.date}>
                                        {new Date(program.date).toLocaleDateString("es-AR")}
                                    </Text>

                                    <Text style={styles.info}>
                                        {totalExercises} ejercicios guardados
                                    </Text>

                                </Pressable>

                            </Swipeable>

                        </View>

                    );

                })}

            </ScrollView>

        </View>

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
        fontSize: 28,
        marginBottom: 20,
        textAlign: "center"
    },

    wrapper: {
        marginBottom: 12
    },

    card: {
        backgroundColor: "#222",
        padding: 20,
        borderRadius: 12
    },

    date: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold"
    },

    info: {
        color: "#aaa",
        marginTop: 6
    },

    deleteButton: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderRadius: 12
    }

});