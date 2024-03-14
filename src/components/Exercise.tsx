import React, { useState, useEffect } from "react";
import type { ExerciseObject, Unit, Weekday } from "../types";
import { useLocalStorageRead } from "../hooks/useLocalStorageRead";
import { useLocalStorageOverwrite } from "../hooks/useLocalStorageOverwrite";
import "../stylesheets/Exercise.css";
import WorkingSet from "./WorkingSet";
import TogglePageVisibilityButton from "./ToggleExerciseVisibilityButton";
import RemoveExerciseButton from "./RemoveExerciseButton";

// add function to click on exercise in order to show, and hide sets
// Exercise completed should close the exercise when checked.
//if already checked and unchecking it (while having the exercise + setmenu open) should not close it

// Restructure positions of buttons, text etc
//implement weekday logic

//details + summary to show and hide

interface ExerciseProps {
  weightUnit: Unit;
  weekday: Weekday;
  exerciseData: ExerciseObject[];
  getExerciseData: () => void;
}

const Exercise: React.FC<ExerciseProps> = ({ weekday, exerciseData: weekExerciseListLength, getExerciseData }) => {
  // Fetch all exercises for the given weekday from local storage
  let weekdayExercises: ExerciseObject[] = [];

  //form, when submitted send to localstorage. Give write an exercisemap,
  // pair weekdayexercies with the weekday and send to localstorageWrite

  const [exercises, setExercises] = useState<ExerciseObject[]>([]);
  // const [exercises, setExercises] = useState(weekdayExercises);

  useEffect(() => {
    weekdayExercises = useLocalStorageRead(weekday);
    setExercises(weekdayExercises);
  }, [weekday, weekExerciseListLength]); // Dependency array includes 'weekday' to re-run the effect when it changes

  // save new sets to localstorage
  // when adding a new set, make the update show directly.
  // currently only updates the page if switching day and then returning.

  // CHANGE: Adds new set to selected exercise, and updates the state variable with the updated array
  const addSet = (exerciseIndex: number, weekday: Weekday): void => {
    const exercisesCopy = [...exercises];
    const selectedExercise = exercisesCopy[exerciseIndex];
    const newSet = { repetitions: 0, weight: 0, completed: false };
    selectedExercise.sets.push(newSet);

    // Replace the old exercise with updated
    exercisesCopy.splice(exerciseIndex, 1, selectedExercise);
    setExercises(exercisesCopy);

    // clears localStorage of selected day and writes new exercises to it
    // runs getExerciseData to make sure every other component based on data in localStorage re-renders
    useLocalStorageOverwrite(new Map<Weekday, ExerciseObject[]>([[weekday, exercises]]));
    getExerciseData();
  };

  const [hiddenExercises, setHiddenExercises] = useState<Set<number>>(new Set<number>());


  // Function to toggle all sets as completed for an exercise
  const toggleAllSetsCompleted = (exerciseIndex: number) => {
    const exercisesCopy: ExerciseObject[] = [...exercises];

    const completed: boolean[] = [];

    exercisesCopy[exerciseIndex].sets.forEach((set) => {
      if (set.completed) {
        completed.push(true);
      }
    });

    // this logic ensures that all sets are marked as complete if one or more sets are marked as complete
    // if all sets are marked as complete they are marked as incomplete by this toggle
    if (completed.length === exercisesCopy[exerciseIndex].sets.length) {
      for (const set of exercisesCopy[exerciseIndex].sets) {
        set.completed = false;
      }
    } else {
      for (const set of exercisesCopy[exerciseIndex].sets) {
        set.completed = true;
      }
    }

    setExercises(exercisesCopy);

    // clears localStorage of selected day and writes new exercises to it
    // runs getExerciseData to make sure every other component based on data in localStorage re-renders
    useLocalStorageOverwrite(new Map<Weekday, ExerciseObject[]>([[weekday, exercises]]));
    getExerciseData();
  };

  // set component
  // buttons to components?
  return (
    <div className="Exercise">
      {exercises.map((exercise, exerciseIndex) => (
        <div key={exerciseIndex} className="exerciseContainer">
          <TogglePageVisibilityButton exerciseIndex={exerciseIndex} setHiddenExercises={setHiddenExercises}/>
          <div className="exerciseHeader">
            <h3>{exercise.name}</h3>
            <strong>Total Sets: {exercise.sets.length}</strong>

            <label className="flexLabel">
              Toggle sets
              <input
                type="checkbox"
                checked={exercise.sets.every((set) => set.completed)}
                onChange={() => toggleAllSetsCompleted(exerciseIndex)}
              />
            </label>
            <RemoveExerciseButton exerciseIndex={exerciseIndex} weekday={weekday} exercises={exercises} getExerciseData={getExerciseData}/>
          </div>
          {!hiddenExercises.has(exerciseIndex) && (
            <>
              <WorkingSet
                weekday={weekday}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                setExercises={setExercises}
                getExerciseData={getExerciseData}
                exercises={exercises}
              />
              <button onClick={() => addSet(exerciseIndex, weekday)} className="addButton">
                Add Set
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Exercise;
