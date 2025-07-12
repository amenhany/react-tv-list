import axios from 'axios'
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL;


export default function RegisterForm() {
    const [userFormData, setUserFormData] = useState({
        username: "",
        email: "",
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

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(userFormData);

        await axios.post(`${API_BASE}/user/register`, userFormData)
        .then(res => console.log(res))
        .catch(err => {
            console.error('Error:', err);
            setErrorMessage(err.response?.data?.message);
        });
    }

    return (
        <form className="container flex-column justify-content-center" id="searchForm" action="/search" onSubmit={handleSubmit} >
            <div className="row mb-3 mt-3">
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
            <div className="row mb-3">
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
            <div className="row mb-3">
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
            <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-success mb-2" onClick={handleSubmit}>
                    Register
                </button>
            </div>
        </form>
    )
}