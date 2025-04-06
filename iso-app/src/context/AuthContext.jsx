import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setUser({ token })
    }
  }, [])

const login = async (email, password) => {
    try {
      const response = await new Promise((resolve) => 
        setTimeout(() => resolve({ 
          data: { 
            token: 'fake-jwt-token',
            email: email // Add email to response
          } 
        }), 1000)
      );
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email); // Store email
      setUser({ 
        token: response.data.token,
        email: email // Add email to user state
      });
      navigate('/');
    } catch (error) {
      throw new Error('Login failed');
    }
  }
  
  // Update the useEffect to load email:
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    if (token) {
      setUser({ token, email });
    }
  }, []);

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail'); // Add this line
    setUser(null);
    navigate('/login');
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}