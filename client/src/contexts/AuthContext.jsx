import axios from 'axios'
import { useState, useEffect, useContext, createContext } from "react"
import Card from '../components/Card';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import { DimmerContext } from './DimmerContext';

const API_BASE = import.meta.env.VITE_API_URL;


export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const { setIsVisible, setContent } = useContext(DimmerContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    function checkSession() {
        axios.get(`${API_BASE}/user/check-session`, { withCredentials: true })
        .then(res => {
            setIsAuthenticated(true);
            setUser(res.data.user || null);
        })
        .catch(err => {
            setIsAuthenticated(false);
            setUser(null);
        })
        .finally(() => {
            setIsLoaded(true);
        });
    }

    useEffect(checkSession, []);

    function openRegisterForm() {
        setContent(
            <Card title="Register">
                <RegisterForm handleLogIn={openLoginForm} />
            </Card>
        );
        setIsVisible(true);
    }

    function openLoginForm() {
        setContent(
            <Card title="Login">
                <LoginForm handleSignUp={openRegisterForm} />
            </Card>
        );
        setIsVisible(true);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, checkSession, openRegisterForm, openLoginForm }}>
            { isLoaded && children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}