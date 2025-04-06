import { useState } from 'react';
import styles from './WorkoutForm.module.css';

export default function WorkoutForm() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState('freeweight');
  const [cableHeight, setCableHeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [workouts, setWorkouts] = useState([]);

  const categories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newWorkout = {
      category: selectedCategory,
      name: exerciseName,
      type: exerciseType,
      cableHeight: exerciseType === 'cable' ? cableHeight : null,
      sets: parseInt(sets),
      reps: parseInt(reps),
      date: new Date().toLocaleString()
    };
    
    setWorkouts([...workouts, newWorkout]);
    // Reset form fields
    setSelectedCategory('');
    setExerciseName('');
    setExerciseType('freeweight');
    setCableHeight('');
    setSets('');
    setReps('');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Track Your Workout</h2>
        
        <div className={styles.formGroup}>
          <label>Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Exercise Name:</label>
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Exercise Type:</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="freeweight"
                checked={exerciseType === 'freeweight'}
                onChange={() => setExerciseType('freeweight')}
              />
              Freeweight
            </label>
            <label>
              <input
                type="radio"
                value="cable"
                checked={exerciseType === 'cable'}
                onChange={() => setExerciseType('cable')}
              />
              Cable
            </label>
          </div>
        </div>

        {exerciseType === 'cable' && (
          <div className={styles.formGroup}>
            <label>Cable Height:</label>
            <input
              type="text"
              value={cableHeight}
              onChange={(e) => setCableHeight(e.target.value)}
              required={exerciseType === 'cable'}
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Sets:</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Reps:</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            min="1"
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Add Workout
        </button>
      </form>

      <div className={styles.workoutList}>
        <h3>Workout History</h3>
        {workouts.map((workout, index) => (
          <div key={index} className={styles.workoutItem}>
            <p><strong>{workout.category}</strong>: {workout.name}</p>
            <p>Type: {workout.type} {workout.cableHeight && `(${workout.cableHeight})`}</p>
            <p>Sets: {workout.sets} × Reps: {workout.reps}</p>
            <p className={styles.timestamp}>{workout.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}