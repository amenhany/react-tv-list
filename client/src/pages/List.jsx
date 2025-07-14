import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from "react";


export default function List() {
    const navigate = useNavigate();
    const { isAuthenticated, user, openLoginForm } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
        navigate('/');
        openLoginForm();
    }
    }, [isAuthenticated]);

    return (
        <>
        </>
    )
}