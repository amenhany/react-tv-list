import axios from 'axios'
import { useEffect } from 'react';
import { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL;


export default function RegisterForm({ handleLogIn }) {
    const { checkSession } = useAuth();

    const [userFormData, setUserFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isFirstInput, setIsFirstInput] = useState(true);
    
    function handleChange(evt) {
        const fieldName = evt.target.name;
        const value = evt.target.value;

        setUserFormData(currData => {
            currData[fieldName] = value;
            return {...currData};
        })

        if (isFirstInput && evt.target.name === "confirmPassword") {
            setIsFirstInput(false);
        }
    }

    useEffect(() => {
        if (!isFirstInput && userFormData.confirmPassword !== userFormData.password) {
            setErrorMessage("Passwords do not match");
        } else {
            setErrorMessage("");
        }
    }, [userFormData.confirmPassword, userFormData.password])
    
    useEffect(() => {
        const debounce = setTimeout(() => {
            axios.put(`${API_BASE}/user/check-data`, { ...userFormData })
            .then(res => setErrorMessage(""))
            .catch(err => setErrorMessage(err.response?.data?.message));
        }, 500);
        
        return () => clearTimeout(debounce);
    }, [userFormData.username])

    function handleSubmit(e) {
        e.preventDefault();

        axios.post(`${API_BASE}/user/register`, userFormData, { withCredentials: true })
        .then(res => {
            checkSession();
        })
        .catch(err => {
            console.error('Error:', err);
            setErrorMessage(err.response?.data?.message);
        });
    }

    return (
        <form className="container flex-column justify-content-center" id="searchForm" action="/search" onSubmit={handleSubmit} >
            <div className="row mb-4 mt-3">
                <div className="col-12">
                    <input 
                    type="text"
                    value={userFormData.username} 
                    onChange={handleChange}
                    name="username" 
                    id="username" 
                    placeholder="Username" 
                    className="form-control me-1" />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-12">
                    <input 
                    type="email" 
                    value={userFormData.email} 
                    onChange={handleChange}
                    name="email" 
                    id="email" 
                    placeholder="Email" 
                    className="form-control me-1" />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-12">
                    <input 
                    type="password" 
                    value={userFormData.password} 
                    onChange={handleChange}
                    name="password" 
                    id="password" 
                    placeholder="Password" 
                    className="form-control me-1" />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-12">
                    <input 
                    type="password" 
                    value={userFormData.confirmPassword} 
                    onChange={handleChange}
                    name="confirmPassword" 
                    id="confirmPassword" 
                    placeholder="Confirm Password" 
                    className="form-control me-1" />
                </div>
            </div>
            <small className="text-danger">{ errorMessage }</small>
            <hr></hr>
            <div className="d-flex mt-3 position-relative align-items-center">
                <p className="form-text mb-2">Already a User? <a className="text-primary link" onClick={handleLogIn}>Log In</a></p>
                <button className="btn btn-success mb-2 ms-auto" onClick={handleSubmit}>
                    Register
                </button>
            </div>
        </form>
    )
}