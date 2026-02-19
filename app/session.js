import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { useWorkout } from "../context/WorkoutContext";

export default function Session() {
  const { type } = useLocalSearchParams();
  const { sessions, addExercise, editExercise, removeExercise } = useWorkout();
  const exercises = sessions[type] || [];

  const [editingExercise, setEditingExercise] = useState(null);
  const [doneExercises, setDoneExercises] = useState({});

  // Modal agregar/editar
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [series, setSeries] = useState("");
  const [reps, setReps] = useState("");
  const [comments, setComments] = useState("");

  // Modal historial
  const [historyModalExercise, setHistoryModalExercise] = useState(null);

  const toggleDone = (id) => {
    setDoneExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openNewExerciseModal = () => {
    setEditingExercise(null);
    setName("");
    setWeight("");
    setSeries("");
    setReps("");
    setComments("");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !weight || !series || !reps) return;

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
    setModalVisible(false);
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
    setEditingExercise(null);
    setModalVisible(false);
  };

  const handleRemove = (exerciseId) => {
    Alert.alert(
      "Borrar ejercicio",
      "¿Estás seguro de que querés borrar este ejercicio?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Borrar", style: "destructive", onPress: () => removeExercise(type, exerciseId) },
      ]
    );
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session {type}</Text>

      <ScrollView style={{ width: "100%", marginTop: 20 }}>
        {exercises.map((ex) => (
          <View key={ex.id} style={styles.exerciseWrapper}>
            <Pressable
              onPress={() => toggleDone(ex.id)}
              onLongPress={() => startEditing(ex)}
              style={[
                styles.exerciseCard,
                doneExercises[ex.id] && { backgroundColor: "#747474" },
              ]}
            >
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseDetail}>
                Weight: {ex.currentWeight} kg
              </Text>
              <Text style={styles.exerciseDetail}>Reps: {ex.currentReps}</Text>
              <Text style={styles.exerciseDetail}>Series: {ex.currentSeries}</Text>
              {ex.comments ? (
                <Text style={styles.exerciseComments}>Comments: {ex.comments}</Text>
              ) : null}
              {doneExercises[ex.id] && <Text style={styles.tick}>✔</Text>}
            </Pressable>

            <View style={styles.buttonsRow}>
              {/* Botón History */}
              <Pressable
                onPress={() => setHistoryModalExercise(ex)}
                style={styles.historyButton}
              >
                <Text style={{ color: "white" }}>History</Text>
              </Pressable>

              {/* Botón borrar */}
              <Pressable
                onPress={() => handleRemove(ex.id)}
                style={styles.removeButton}
              >
                <Text style={{ color: "red" }}>🗑️</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botón agregar ejercicio */}
      <Pressable style={styles.addButton} onPress={openNewExerciseModal}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

      {/* Modal agregar/editar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Exercise name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Weight"
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
              placeholder="Reps"
              placeholderTextColor="#999"
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Comments"
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
              History: {historyModalExercise?.name}
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
  title: { color: "white", fontSize: 24 },
  exerciseWrapper: { marginBottom: 12 },
  exerciseCard: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 12,
    width: "95%",
    alignSelf: "center",
  },
  exerciseName: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  exerciseDetail: { color: "#ccc", fontSize: 16 },
  exerciseComments: { color: "#aaa", fontStyle: "italic", marginTop: 4 },
  tick: { color: "white", fontSize: 18, position: "absolute", right: 16, top: 16, fontWeight: "bold" },
  buttonsRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 4 },
  historyButton: {
    backgroundColor: "#555",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  removeButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
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
  historyCardLatest: {
    backgroundColor: "#afafaf",
    borderColor: "#888888",
    borderWidth: 1,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#fff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: { fontSize: 28, fontWeight: "bold" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "80%", backgroundColor: "white", padding: 20, borderRadius: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 12 },
  saveButton: { backgroundColor: "#111", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 8 },
  saveButtonText: { color: "white", fontWeight: "bold" },
  closeButton: { backgroundColor: "#cac6c6", padding: 12, borderRadius: 8, alignItems: "center" },
  closeButtonText: { color: "black", fontWeight: "bold" },
});
