import axios from 'axios'
import { useContext } from 'react';
import { useState } from "react";
import { DimmerContext } from '../contexts/DimmerContext';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL;


export default function LoginForm({ handleSignUp }) {
    const { setIsVisible } = useContext(DimmerContext);
    const { checkSession } = useAuth();


    const [userFormData, setUserFormData] = useState({
        username: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    
    function handleChange(evt) {
        const fieldName = evt.target.name;
        const value = evt.target.value;

        setUserFormData(currData => {
            currData[fieldName] = value;
            return {...currData};
        })
    }

    function handleSubmit(e) {
        e.preventDefault();

        axios.post(`${API_BASE}/user/login`, userFormData, { withCredentials: true })
        .then(res => {
            setIsVisible(false);
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
                    type="password" 
                    value={userFormData.password} 
                    onChange={handleChange}
                    name="password" 
                    id="password" 
                    placeholder="Password" 
                    className="form-control me-1" />
                </div>
            </div>
            <small className="text-danger">{ errorMessage }</small>
            <hr></hr>
            <div className="d-flex mt-2 position-relative align-items-center">
                <p className="form-text mb-2">No Account? <a className="text-primary link" onClick={handleSignUp}>Sign Up</a></p>
                <button className="btn btn-success mb-2 ms-auto" onClick={handleSubmit}>
                    Log In
                </button>
            </div>
        </form>
    )
}