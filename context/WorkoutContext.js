import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase"; // ajusta la ruta según tu proyecto

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
    const [sessions, setSessions] = useState({
        A: [],
        B: [],
        C: [],
    });

    // 🔹 Cargar ejercicios desde Firestore al iniciar
    useEffect(() => {
        const fetchSessions = async () => {
            const sessionTypes = ["A", "B", "C"];
            const newSessions = { A: [], B: [], C: [] };

            for (let type of sessionTypes) {
                try {
                    const exercisesSnap = await getDocs(
                        collection(db, "sessions", type, "exercises")
                    );
                    newSessions[type] = exercisesSnap.docs.map((doc) => doc.data());
                } catch (err) {
                    console.log(`Error al traer ejercicios ${type}:`, err);
                }
            }

            setSessions(newSessions);
        };

        fetchSessions();
    }, []);

    // 🔹 Agregar ejercicio
    const addExercise = async (sessionType, exercise) => {
        setSessions((prev) => ({
            ...prev,
            [sessionType]: [...prev[sessionType], exercise],
        }));

        try {
            const exerciseRef = doc(
                collection(db, "sessions", sessionType, "exercises"),
                exercise.id
            );
            await setDoc(exerciseRef, exercise);
            console.log("Ejercicio agregado en Firestore!");
        } catch (err) {
            console.log("Error al agregar ejercicio:", err);
        }
    };

    // 🔹 Editar ejercicio
    const editExercise = async (sessionType, updatedExercise) => {
        setSessions((prev) => ({
            ...prev,
            [sessionType]: prev[sessionType].map((ex) =>
                ex.id === updatedExercise.id ? updatedExercise : ex
            ),
        }));

        try {
            const exerciseRef = doc(
                collection(db, "sessions", sessionType, "exercises"),
                updatedExercise.id
            );
            await setDoc(exerciseRef, updatedExercise);
            console.log("Ejercicio editado en Firestore!");
        } catch (err) {
            console.log("Error al editar ejercicio:", err);
        }
    };

    // 🔹 Borrar ejercicio
    const removeExercise = async (sessionType, exerciseId) => {
        setSessions((prev) => ({
            ...prev,
            [sessionType]: prev[sessionType].filter((e) => e.id !== exerciseId),
        }));

        try {
            const exerciseRef = doc(
                collection(db, "sessions", sessionType, "exercises"),
                exerciseId
            );
            await deleteDoc(exerciseRef);
            console.log("Ejercicio borrado de Firestore!");
        } catch (err) {
            console.log("Error al borrar ejercicio:", err);
        }
    };

    return (
        <WorkoutContext.Provider
            value={{ sessions, addExercise, editExercise, removeExercise }}
        >
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkout() {
    return useContext(WorkoutContext);
}
