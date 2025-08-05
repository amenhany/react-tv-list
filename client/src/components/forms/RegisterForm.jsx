import axios from "../../js/axios.js";
import { useEffect } from 'react';
import { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import PasswordInput from '../PasswordInput';
import toast from 'react-hot-toast';


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
            axios.post(`/user/check-data`, { ...userFormData })
            .then(res => setFormErrors({}))
            .catch(err => setFormErrors(err.response?.data?.errors));
        }, 500);
        
        return () => clearTimeout(debounce);
    }, [userFormData])

    function handleSubmit(e) {
        e.preventDefault();

        axios.post(`/user/register`, userFormData, { withCredentials: true })
        .then(res => {
            checkSession();
            toast.success(`Welcome, ${userFormData.username}!`)
        })
        .catch(err => {
            console.error('Error:', err);
            setFormErrors(err.response?.data?.errors);
            if (!err.response?.data?.errors) {
                toast.error('Could not create your profile.')
            }
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
                    <label htmlFor="username" className="form-label label-icon">Username</label>
                    <div className="invalid-tooltip">{formErrors?.username}</div>
                    <svg className="input-icon selectDisable" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
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
                    <label htmlFor="email" className="form-label label-icon">Email</label>
                    <div className="invalid-tooltip">{formErrors?.email}</div>
                    <svg className="input-icon selectDisable" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M19.2 5H4.8C3.81 5 3.009 5.81 3.009 6.8L3 17.6C3 18.59 3.81 19.4 4.8 19.4H19.2C20.19 19.4 21 18.59 21 17.6V6.8C21 5.81 20.19 5 19.2 5ZM19.2 17.6H4.8V8.6L12 13.1L19.2 8.6V17.6ZM4.8 6.8L12 11.3L19.2 6.8H4.8Z" fill=""></path> </g></svg>
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