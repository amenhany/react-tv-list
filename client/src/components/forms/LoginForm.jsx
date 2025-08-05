import axios from "../../js/axios.js";
import { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import PasswordInput from '../PasswordInput';
import toast from 'react-hot-toast';


export default function LoginForm({ handleSignUp }) {
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

        const response = axios.post(`/user/login`, userFormData, { withCredentials: true })
        .then(res => {
            checkSession();
            toast.success(`Welcome back, ${userFormData.username}!`)
        })
        .catch(err => {
            console.error('Error:', err);
            setErrorMessage(err.response?.data?.message);
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
                    className="form-control" />
                    <label htmlFor="username" className="form-label label-icon">Username</label>
                    <svg className="input-icon selectDisable" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </div>


                <div className="mb-3">
                    <PasswordInput 
                        name="password" 
                        display="Password"
                        value={userFormData.password}
                        change={handleChange}
                        validFeedback={false}
                    />
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