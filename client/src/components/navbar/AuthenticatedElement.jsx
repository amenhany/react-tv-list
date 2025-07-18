import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL;


export default function AuthenticatedElement() {
    const { isAuthenticated, checkSession, openLoginForm, openRegisterForm } = useAuth();

    function logOut() {
        axios.get(`${API_BASE}/user/logout`, { withCredentials: true })
        .then(checkSession);
    }

    if (!isAuthenticated) {
        return (
            <>
                <button className="btn btn-outline-success cancel-button ms-3" onClick={openLoginForm}>Log In</button>
                <button className="btn btn-outline-primary cancel-button ms-3" onClick={openRegisterForm}>Sign Up</button>
            </>
        )
    }
    else {
        return (
            <>
                <button className="btn btn-outline-primary cancel-button ms-3" onClick={logOut}>Log Out</button>
            </>
        )
    }
    
}