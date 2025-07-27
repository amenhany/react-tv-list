import axios from 'axios'
import { useState, useEffect, useContext, createContext } from "react"
import Card from '../components/Card';
import RegisterForm from '../components/forms/RegisterForm';
import LoginForm from '../components/forms/LoginForm';
import { useDimmerContext } from './DimmerContext';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL;


export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsVisible, setContent } = useDimmerContext();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [dimmerContent, setDimmerContent] = useState(null);

    function checkSession() {
        axios.get(`${API_BASE}/user/check-session`, { withCredentials: true })
        .then(res => {
            setIsAuthenticated(true);
            setUser(res.data.user || null);

            if (dimmerContent) {
                setContent(dimmerContent);
                setDimmerContent(null);
            }
            else {
                setIsVisible(false);
            }

            const returnTo = location.state?.returnTo;
            if (returnTo && location.pathname === '/') {
                navigate(returnTo);
            }
        })
        .catch(err => {
            setIsAuthenticated(false);
            setUser(null);
        })
        .finally(() => {
            setIsLoaded(true);
        });
    }

    function requireLogin() {
        if (!isAuthenticated) {
            navigate('/', { state: { returnTo: location.pathname } });
            openLoginForm();
        }
    }

    useEffect(() => {
        setDimmerContent(null);
    }, [location.pathname]);

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
        <AuthContext.Provider value={{ isAuthenticated, user, checkSession, requireLogin, setDimmerContent, openRegisterForm, openLoginForm }}>
            { isLoaded && children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}