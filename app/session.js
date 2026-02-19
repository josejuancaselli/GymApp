import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { Swipeable } from "react-native-gesture-handler";
import { useWorkout } from "../context/WorkoutContext";

export default function Session() {
    const { type } = useLocalSearchParams();
    const { sessions, addExercise, editExercise, removeExercise } = useWorkout();

    const [editingExercise, setEditingExercise] = useState(null);
    const [doneExercises, setDoneExercises] = useState({});
    const [exercisesState, setExercisesState] = useState(sessions[type] || []);

    // Modal de agregar/editar
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("");
    const [series, setSeries] = useState("");
    const [reps, setReps] = useState("");
    const [comments, setComments] = useState("");

    // Modal de historial
    const [historyModalExercise, setHistoryModalExercise] = useState(null);

    // Toggle check
    const toggleDone = (id) => {
        setDoneExercises((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleSave = async () => {
        if (!name || !weight || !reps) return;

        const newExercise = {
            id: Date.now().toString(),
            name,
            currentWeight: Number(weight),
            currentSeries: Number(series),
            currentReps: Number(reps),
            comments,
            history: [
                {
                    date: new Date().toISOString(),
                    weight: Number(weight),
                    series: Number(series),
                    reps: Number(reps),
                },
            ],
        };

        await addExercise(type, newExercise);
        setExercisesState((prev) => [...prev, newExercise]);

        setModalVisible(false);
        setName("");
        setWeight("");
        setSeries("");
        setReps("");
        setComments("");
    };

    const startEditing = (exercise) => {
        setEditingExercise(exercise);
        setName(exercise.name);
        setWeight(exercise.currentWeight.toString());
        setSeries(exercise.currentSeries.toString());
        setReps(exercise.currentReps.toString());
        setComments(exercise.comments || "");
        setModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!editingExercise) return;

        const updatedExercise = {
            ...editingExercise,
            currentWeight: Number(weight),
            currentSeries: Number(series),
            currentReps: Number(reps),
            comments,
            history: [
                ...editingExercise.history,
                {
                    date: new Date().toISOString(),
                    weight: Number(weight),
                    series: Number(series),
                    reps: Number(reps),
                },
            ],
        };

        await editExercise(type, updatedExercise);
        setExercisesState((prev) =>
            prev.map((ex) => (ex.id === updatedExercise.id ? updatedExercise : ex))
        );

        setEditingExercise(null);
        setModalVisible(false);
        setName("");
        setWeight("");
        setSeries("");
        setReps("");
        setComments("");
    };

    const resetModal = () => {
        setEditingExercise(null);
        setModalVisible(false);
        setName("");
        setWeight("");
        setSeries("");
        setReps("");
        setComments("");
    };

    const handleRemove = async (id) => {
        await removeExercise(type, id);
        setExercisesState((prev) => prev.filter((ex) => ex.id !== id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sesion {type}</Text>

            <DraggableFlatList
            style={{marginBottom:110}}
                data={exercisesState}
                keyExtractor={(item) => item.id}
                onDragEnd={({ data }) => setExercisesState(data)}
                renderItem={({ item, drag, isActive }) => (
                    <ScaleDecorator>
                        <View style={styles.exerciseWrapper}>
                            <Swipeable
                                renderRightActions={() => (
                                    <Pressable
                                        onPress={() => handleRemove(item.id)}
                                        style={{
                                            backgroundColor: "red",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: 80,
                                            margin: 0,
                                            borderRadius: 12,
                                        }}
                                    >
                                        <MaterialIcons name="delete" size={28} color="white" />
                                    </Pressable>
                                )}
                            >
                                <Pressable
                                    onPress={() => toggleDone(item.id)}
                                    onLongPress={() => startEditing(item)}
                                    style={[
                                        styles.exerciseCard,
                                        doneExercises[item.id] && { backgroundColor: "#747474" },
                                    ]}
                                >
                                    <Pressable
                                        onLongPress={drag}
                                        delayLongPress={0}
                                        style={{
                                            marginRight: 10,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <MaterialIcons name="drag-handle" size={24} color="#999" />
                                    </Pressable>

                                    <View style={{ width: "70%" }}>
                                        <Text style={styles.exerciseName}>{item.name}</Text>
                                        <Text style={styles.exerciseDetail}>Peso: {item.currentWeight} kg</Text>
                                        <Text style={styles.exerciseDetail}>Series: {item.currentSeries}</Text>
                                        <Text style={styles.exerciseDetail}>Reps: {item.currentReps}</Text>
                                        {item.comments && (
                                            <Text style={styles.exerciseComments}>Notas: {item.comments}</Text>
                                        )}
                                    </View>

                                    <Pressable
                                        onPress={() => setHistoryModalExercise(item)}
                                        style={styles.historyButton}
                                    >
                                        <Text style={{ color: "white" }}>History</Text>
                                    </Pressable>
                                </Pressable>
                            </Swipeable>
                        </View>
                    </ScaleDecorator>
                )}
            />

            {/* Botón agregar ejercicio */}
            <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+</Text>
            </Pressable>

            {/* Modal agregar/editar */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            placeholder="Nombre del ejercicio"
                            placeholderTextColor="#999"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Peso"
                            placeholderTextColor="#999"
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Series"
                            placeholderTextColor="#999"
                            value={series}
                            onChangeText={setSeries}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Repeticiones"
                            placeholderTextColor="#999"
                            value={reps}
                            onChangeText={setReps}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Notas"
                            placeholderTextColor="#999"
                            value={comments}
                            onChangeText={setComments}
                            style={styles.input}
                        />
                        <Pressable
                            onPress={editingExercise ? handleSaveEdit : handleSave}
                            style={styles.saveButton}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </Pressable>
                        <Pressable onPress={resetModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal historial */}
            <Modal
                visible={!!historyModalExercise}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.historyTitle}>
                            {historyModalExercise?.name}
                        </Text>
                        <ScrollView style={styles.historyList}>
                            {historyModalExercise?.history
                                .slice()
                                .reverse()
                                .map((h, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.historyCard,
                                            index === 0 && styles.historyCardLatest,
                                        ]}
                                    >
                                        <Text style={styles.historyDate}>
                                            {new Date(h.date).toLocaleDateString("es-AR", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </Text>
                                        <Text style={styles.historyDetail}>Weight: {h.weight} kg</Text>
                                        <Text style={styles.historyDetail}>Reps: {h.reps}</Text>
                                        <Text style={styles.historyDetail}>Series: {h.series}</Text>
                                    </View>
                                ))}
                        </ScrollView>
                        <Pressable
                            onPress={() => setHistoryModalExercise(null)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#111", padding: 20 },
    title: { color: "white", fontSize: 24, marginLeft: "auto", marginRight: "auto", marginBottom: 20 },
    exerciseWrapper: { marginBottom: 12 },
    exerciseCard: {
        backgroundColor: "#222",
        padding: 16,
        borderRadius: 12,
        width: "100%",
        alignSelf: "center",
        display: "flex",
        flexDirection: "row",

    },
    exerciseName: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 6 },
    exerciseDetail: { color: "#ccc", fontSize: 16 },
    exerciseComments: { color: "#aaa", fontStyle: "italic", marginTop: 4 },
    tick: { color: "white", fontSize: 18, fontWeight: "bold" },
    historyButton: {
        backgroundColor: "#555",
        alignSelf: "flex-end",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginTop: 4,
        marginRight: 8,
    },
    historyTitle: { fontWeight: "bold", fontSize: 20, marginBottom: 12, textAlign: "center" },
    historyList: { maxHeight: 300, marginBottom: 12 },
    historyCard: {
        backgroundColor: "#f5f5f5",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    historyDate: { fontSize: 14, color: "#555", marginBottom: 4 },
    historyDetail: { fontSize: 16, color: "#333" },
    historyCardLatest: { backgroundColor: "#afafaf", borderColor: "#888888", borderWidth: 1 },
    addButton: { position: "absolute", bottom: 30, right: 30, backgroundColor: "#fff", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
    addButtonText: { fontSize: 28, fontWeight: "bold" },
    modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
    modalContent: { width: "80%", backgroundColor: "white", padding: 20, borderRadius: 12 },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 12 },
    saveButton: { backgroundColor: "#111", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 8 },
    saveButtonText: { color: "white", fontWeight: "bold" },
    closeButton: { backgroundColor: "#cac6c6", padding: 12, borderRadius: 8, alignItems: "center" },
    closeButtonText: { color: "black", fontWeight: "bold" },
});
