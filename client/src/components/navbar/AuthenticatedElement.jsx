import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext';
import { useDimmerContext } from '../../contexts/DimmerContext';
import ConfirmationPopUp from '../forms/ConfirmationPopUp';

const API_BASE = import.meta.env.VITE_API_URL;


export default function AuthenticatedElement() {
    const { isAuthenticated, checkSession, openLoginForm, openRegisterForm } = useAuth();
    const { setIsVisible, setContent } = useDimmerContext();

    function logOut() {
        setContent(
            <ConfirmationPopUp 
                buttonText="Log Out" 
                buttonColor="primary" 
                message="Are you sure you want to log out?"
                fn={() => {
                    axios.get(`${API_BASE}/user/logout`, { withCredentials: true })
                    .then(checkSession);
                    setIsVisible(false);
            }} />
        );
        setIsVisible(true);
    }

    if (!isAuthenticated) {
        return (
            <>
                <button className="btn btn-outline-success ms-3" onClick={openLoginForm}>Log In</button>
                <button className="btn btn-outline-primary ms-3" onClick={openRegisterForm}>Sign Up</button>
            </>
        )
    }
    else {
        return (
            <>
                <button className="btn btn-outline-light ms-3" onClick={logOut}>Log Out</button>
            </>
        )
    }
    
}