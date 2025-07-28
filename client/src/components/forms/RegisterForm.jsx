import axios from 'axios'
import { useEffect } from 'react';
import { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import PasswordInput from '../PasswordInput';

const API_BASE = import.meta.env.VITE_API_URL;


export default function RegisterForm({ handleLogIn }) {
    const { checkSession } = useAuth();

    const [userFormData, setUserFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [isFirstInput, setIsFirstInput] = useState({
        username: true,
        email: true,
        password: true,
        confirmPassword: true
    });
    
    function handleChange(evt) {
        const fieldName = evt.target.name;
        const value = evt.target.value;

        setUserFormData(currData => {
            currData[fieldName] = value;
            return {...currData};
        })
    }
    
    useEffect(() => {
        const debounce = setTimeout(() => {
            axios.post(`${API_BASE}/user/check-data`, { ...userFormData })
            .then(res => setFormErrors({}))
            .catch(err => setFormErrors(err.response?.data?.errors));
        }, 500);
        
        return () => clearTimeout(debounce);
    }, [userFormData])

    function handleSubmit(e) {
        e.preventDefault();

        axios.post(`${API_BASE}/user/register`, userFormData, { withCredentials: true })
        .then(res => {
            checkSession();
        })
        .catch(err => {
            console.error('Error:', err);
            setFormErrors(err.response?.data?.errors);
        });
    }

    return (
        <form className="container flex-column justify-content-center" id="searchForm" action="/search" onSubmit={handleSubmit} >

                <div className="form-floating mb-3">
                    <input 
                    type="text"
                    value={userFormData.username} 
                    onChange={handleChange}
                    name="username" 
                    id="username" 
                    placeholder="Username" 
                    onBlur={() => setIsFirstInput({...isFirstInput, username: false})}
                    className={"form-control" + (isFirstInput.username ? "" : (formErrors?.username ? " is-invalid" : " is-valid"))} />
                    <label htmlFor="username" className="form-label">Username</label>
                    <div className="invalid-tooltip">{formErrors?.username}</div>
                </div>


                <div className="form-floating mb-3">
                    <input 
                    type="email" 
                    value={userFormData.email} 
                    onChange={handleChange}
                    name="email" 
                    id="email" 
                    placeholder="Email" 
                    onBlur={() => setIsFirstInput({...isFirstInput, email: false})}
                    className={"form-control" + (isFirstInput.email ? "" : (formErrors?.email ? " is-invalid" : " is-valid"))} />
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className="invalid-tooltip">{formErrors?.email}</div>
                </div>

                <div className="mb-3">
                    <PasswordInput 
                        name="password" 
                        display="Password"
                        value={userFormData.password}
                        change={handleChange}
                        error={formErrors.password}
                        validFeedback={true}
                    />
                </div>

                <div className="mb-3">
                    <PasswordInput 
                        name="confirmPassword" 
                        display="Confirm Password"
                        value={userFormData.confirmPassword}
                        change={handleChange}
                        error={formErrors.confirmPassword}
                        validFeedback={true}
                    />
                </div>

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