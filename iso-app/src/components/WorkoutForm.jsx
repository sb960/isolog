import { useState, useEffect } from 'react';
import styles from './WorkoutForm.module.css';

export default function WorkoutForm() {
  const [gymLocation, setGymLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState('freeweight');
  const [cableHeight, setCableHeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lb');
  const [sets, setSets] = useState(1);
  const [reps, setReps] = useState([]);
  const [sameReps, setSameReps] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [weights, setWeights] = useState([]);
  const [sameWeight, setSameWeight] = useState(true);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    if (sameReps) {
      setReps(Array(sets).fill(''));
    } else {
      setReps(prev => [...prev, ...Array(Math.max(sets - prev.length, 0)).fill('')]);
    }
  }, [sets, sameReps]);

  useEffect(() => {
    if (sameWeight) {
      setWeights(Array(sets).fill(''));
    } else {
      setWeights(prev => [...prev, ...Array(Math.max(sets - prev.length, 0)).fill('')]);
    }
  }, [sets, sameWeight]);

  const categories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

  const handleWeightChange = (index, value) => {
    const newWeights = [...weights];
    newWeights[index] = value;
    setWeights(newWeights);
  };

  const handleRepChange = (index, value) => {
    const newReps = [...reps];
    newReps[index] = value;
    setReps(newReps);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedWeights = sameWeight ? Array(sets).fill(weights[0]) : weights;
    
    const newWorkout = {
      gymLocation,
      category: selectedCategory || 'Uncategorized',
      name: exerciseName,
      type: exerciseType,
      cableHeight: exerciseType === 'cable' ? cableHeight : null,
      sets: parseInt(sets),
      reps: sameReps ? Array(sets).fill(parseInt(reps[0])) : reps.map(r => parseInt(r)),
      weights: processedWeights.map(w => parseFloat(w)),
      weightUnit,
      date: new Date().toISOString()
    };
    
    setWorkouts([newWorkout, ...workouts]);
    resetForm();
  };

  const resetForm = () => {
    setGymLocation('');
    setSelectedCategory('');
    setExerciseName('');
    setExerciseType('freeweight');
    setCableHeight('');
    setWeights(Array(sets).fill(''));
    setWeightUnit('lb');
    setSets(1);
    setReps(Array(sets).fill(''));
    setSameWeight(true);
    setSameReps(true);
  };

  const removeWorkout = (index) => {
    const updatedWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(updatedWorkouts);
  };

  const filteredWorkouts = workouts
    .filter(workout => {
      const searchDate = new Date(workout.date).toISOString().split('T')[0];
      return (
        searchDate.includes(searchTerm) ||
        workout.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.gymLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by date (YYYY-MM-DD) or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Track Your Workout</h2>

        <div className={styles.formGroup}>
          <label>Gym Location:</label>
          <input
            type="text"
            value={gymLocation}
            onChange={(e) => setGymLocation(e.target.value)}
            required
          />
        </div>

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

        <div className={styles.formGroup}>
          <label>Sets:</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(Math.max(1, e.target.value))}
            min="1"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={sameWeight}
              onChange={(e) => setSameWeight(e.target.checked)}
            />
            Same weight for all sets
          </label>
          <div className={styles.weightGrid}>
            {sameWeight ? (
              <input
                type="number"
                value={weights[0] || ''}
                onChange={(e) => handleWeightChange(0, e.target.value)}
                min="0"
                step="0.5"
                required
              />
            ) : (
              Array.from({ length: sets }).map((_, index) => (
                <div key={index} className={styles.setWeight}>
                  <label>Set {index + 1}:</label>
                  <input
                    type="number"
                    value={weights[index] || ''}
                    onChange={(e) => handleWeightChange(index, e.target.value)}
                    min="0"
                    step="0.5"
                    required
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Weight Unit:</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="lb"
                checked={weightUnit === 'lb'}
                onChange={() => setWeightUnit('lb')}
              />
              lb
            </label>
            <label>
              <input
                type="radio"
                value="kg"
                checked={weightUnit === 'kg'}
                onChange={() => setWeightUnit('kg')}
              />
              kg
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={sameReps}
              onChange={(e) => setSameReps(e.target.checked)}
            />
            Same reps for all sets
          </label>
          <div className={styles.repsGrid}>
            {sameReps ? (
              <input
                type="number"
                value={reps[0] || ''}
                onChange={(e) => handleRepChange(0, e.target.value)}
                min="1"
                required
              />
            ) : (
              Array.from({ length: sets }).map((_, index) => (
                <div key={index} className={styles.setReps}>
                  <label>Set {index + 1} Reps:</label>
                  <input
                    type="number"
                    value={reps[index] || ''}
                    onChange={(e) => handleRepChange(index, e.target.value)}
                    min="1"
                    required
                  />
                </div>
              ))
            )}
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

        <button type="submit" className={styles.submitButton}>
          Add Workout
        </button>
      </form>

      <div className={styles.workoutHistory}>
        {filteredWorkouts.map((workout, index) => (
          <div key={index} className={styles.workoutGroup}>
            <div className={styles.workoutHeader}>
              <h3>{new Date(workout.date).toLocaleDateString()}</h3>
              <h4>{workout.category || 'Uncategorized'} • {workout.gymLocation}</h4>
            </div>
            <div className={styles.workoutDetails}>
              <p><strong>{workout.name}</strong></p>
              <div className={styles.setList}>
                {workout.weights.map((weight, setIndex) => (
                  <div key={setIndex} className={styles.setItem}>
                    <span>Set {setIndex + 1}:</span>
                    <span>{weight}{workout.weightUnit}</span>
                    <span>× {workout.reps[setIndex]} reps</span>
                  </div>
                ))}
              </div>
              <button 
                className={styles.deleteButton}
                onClick={() => removeWorkout(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}