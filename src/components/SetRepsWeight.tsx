import React, { useState, useEffect } from "react";
import type { ExerciseObject, WorkingSet } from "../types";

type SetRepsWeightProps = {
  exercise: ExerciseObject;
  updateExercise: (updatedExercise: ExerciseObject) => void;
};

const SetRepsWeight: React.FC<SetRepsWeightProps> = ({
  exercise,
  updateExercise,
}) => {
  // Local state to manage edits to sets
  const [editableSets, setEditableSets] = useState<WorkingSet[]>(exercise.sets);

  useEffect(() => {
    setEditableSets(exercise.sets);
  }, [exercise.sets]);

  const handleSetChange = (
    index: number,
    field: "weight" | "repetitions",
    value: number
  ) => {
    const updatedSets = editableSets.map((set, idx) =>
      idx === index ? { ...set, [field]: value } : set
    );
    setEditableSets(updatedSets);

    // Construct an updated exercise object with the new sets
    const updatedExercise = { ...exercise, sets: updatedSets };
    // Correctly pass the updated exercise object to the updateExercise function
    updateExercise(updatedExercise);
  };
  const addSet = () => {
    const newSet: WorkingSet = {
      repetitions: 10,
      weight: 100,
      completed: false,
    };
    const updatedSets = [...editableSets, newSet];
    setEditableSets(updatedSets);

    const updatedExercise = { ...exercise, sets: updatedSets };
    updateExercise(updatedExercise);
  };

  const removeSet = (index: number) => {
    const updatedSets = editableSets.filter((_, idx) => idx !== index);
    setEditableSets(updatedSets);
    updateExercise({ ...exercise, sets: updatedSets });
  };

  const toggleSetCompleted = (index: number) => {
    const updatedSets = editableSets.map((set, idx) =>
      idx === index ? { ...set, completed: !set.completed } : set
    );
    setEditableSets(updatedSets);
    updateExercise({ ...exercise, sets: updatedSets });
  };

  const toggleAllSetsCompleted = () => {
    const allCompleted = editableSets.every((set) => set.completed);
    const updatedSets = editableSets.map((set) => ({
      ...set,
      completed: !allCompleted,
    }));
    setEditableSets(updatedSets);
    updateExercise({ ...exercise, sets: updatedSets });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>{exercise.name}</h3>
        <div>
          <button onClick={addSet} style={{ marginRight: "10px" }}>
            Add Set
          </button>
          <button onClick={toggleAllSetsCompleted}>✔</button>
        </div>
      </div>
      {editableSets.map((set, index) => (
        <div
          key={index}
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <label style={{ marginRight: "5px" }}>
            Reps:
            <input
              type="number"
              value={set.repetitions}
              onChange={(e) =>
                handleSetChange(index, "repetitions", parseInt(e.target.value))
              }
              style={{ margin: "0 5px" }}
            />
          </label>
          <label style={{ marginRight: "5px" }}>
            Weight:
            <input
              type="number"
              value={set.weight}
              onChange={(e) =>
                handleSetChange(index, "weight", parseInt(e.target.value))
              }
              style={{ margin: "0 5px" }}
            />
          </label>
          <input
            type="checkbox"
            checked={set.completed}
            onChange={() => toggleSetCompleted(index)}
            style={{ marginRight: "5px" }}
          />
          <span>Completed</span>
          <button
            onClick={() => removeSet(index)}
            style={{ marginLeft: "auto" }}
          >
            Remove Set
          </button>
        </div>
      ))}
    </div>
  );
};

export default SetRepsWeight;
