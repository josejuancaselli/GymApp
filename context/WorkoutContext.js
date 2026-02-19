import { createContext, useContext, useState } from "react";

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
    const [sessions, setSessions] = useState({
        A: [],
        B: [],
        C: [],
    });

    const addExercise = (sessionType, exercise) => {
        setSessions((prev) => ({
            ...prev,
            [sessionType]: [...prev[sessionType], exercise],
        }));
    };

    const removeExercise = (sessionType, exerciseId) => {
        setSessions((prev) => ({
            ...prev,
            [sessionType]: prev[sessionType].filter(
                (e) => e.id !== exerciseId
            ),
        }));
    };


    return (
        <WorkoutContext.Provider value={{ sessions, addExercise, removeExercise, setSessions }}>

            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkout() {
    return useContext(WorkoutContext);
}
