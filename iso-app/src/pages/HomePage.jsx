import { useAuth } from '../context/AuthContext'
import styles from './HomePage.module.css'
import { Link } from 'react-router-dom';

export default function HomePage() {
    const { user, logout } = useAuth();
  
    return (
        <div className={styles.container}>
        <h1>Welcome to IsoLog</h1>
        <p>Logged in as: {user?.email}</p>
        <div className={styles.navButtons}>
            <Link to="/workout" className={styles.navButton}>
                Track Workout
            </Link>
        {/* <h3>What will your Workout be Today?</h3>
        <ul>
            <li>Chest</li>
            <li>Back</li>
            <li>Legs</li>
            <li>Shoulders</li>
            <li>Arms</li>
            <li>Core</li>
            <li>Cardio</li>
        </ul> */}
            <button onClick={logout} className={styles.logoutButton}>
                Logout
            </button>
        </div>
    </div>
    );
}