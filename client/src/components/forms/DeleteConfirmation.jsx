import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { DimmerContext } from "../../contexts/DimmerContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;


export default function DeleteConfirmation() {
    const { checkSession, openRegisterForm } = useAuth();
    const { setIsVisible } = useContext(DimmerContext);
    const navigate = useNavigate();

    function handleDeleteUser() {
        axios.delete(`${API_BASE}/user/`, { withCredentials: true })
        .then(res => {
            checkSession();
            navigate('/');
            openRegisterForm();
        });
    }

    function handleCancel() {
        setIsVisible(false);
    }

    return (
        <>
            <p className="card-text py-1 me-1">Are you sure you want to delete your account?</p>
            <button onClick={handleDeleteUser} className="btn btn-danger me-2 delete-button">Delete</button>
            <button onClick={handleCancel} className="btn btn-outline-secondary cancel-button">Cancel</button>
        </>
    )
}