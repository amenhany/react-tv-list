import { useEffect, useState } from "react";
import { useDimmerContext } from "../../contexts/DimmerContext";
import PasswordForm from "./PasswordForm";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;


export default function UpdateUserForm({ data, setData, passwordRef }) {
    const [formErrors, setFormErrors] = useState({
        username: "",
        email: "",
        bio: "",
        password: ""
    });

    const { setIsVisible, setContent } = useDimmerContext();


    useEffect(() => {
        const debounce = setTimeout(() => {
            const { avatar, ...dataToCheck } = data;
            axios.patch(`${API_BASE}/user/check-data`, { ...dataToCheck }, { withCredentials: true })
            .then(res => setFormErrors({}))
            .catch(err => setFormErrors(err.response?.data?.errors));
        }, 500);
        return () => clearTimeout(debounce);
    }, [data]);

    function openPasswordForm() {
        setContent(<PasswordForm />);
        setIsVisible(true);
    }

    function handleChange(evt) {
        const fieldName = evt.target.name;
        const value = evt.target.value;

        setData(currData => {
            currData[fieldName] = value;
            return {...currData};
        });

        if (fieldName === 'password') {
            passwordRef.current.classList.remove('is-invalid');
        }
    }

    return (
        <form className="needs-validation" noValidate onSubmit={evt => evt.preventDefault()}>
            <div className="form-floating position-relative mb-3">
                <input 
                type="text" 
                value={data.username} 
                onChange={handleChange}
                name="username" 
                id="username" 
                placeholder="Username" 
                className={"form-control" + (formErrors?.username ? " is-invalid" : " is-valid")} />
                <label htmlFor="username" className="form-label">Username</label>
                <div className="invalid-tooltip">{formErrors?.username}</div>
            </div>
            
            <div className="form-floating position-relative mb-3">
                <input 
                type="email" 
                value={data.email} 
                onChange={handleChange}
                name="email" 
                id="email" 
                placeholder="Email" 
                className={"form-control" + (formErrors?.email ? " is-invalid" : " is-valid")} />
                <label htmlFor="email" className="form-label">Email</label>
                <div className="invalid-tooltip">{formErrors?.email}</div>
            </div>

            <div className="form-floating position-relative mb-3">
                <textarea 
                value={data.bio}
                onChange={handleChange}
                name="bio"
                id="bio"
                placeholder="Bio"
                className={"form-control" + (formErrors?.bio ? " is-invalid" : "")}
                style={{ height: "100px" }} />
                <label htmlFor="bio" className="form-label">Bio</label>
                <div className="invalid-tooltip">{formErrors?.bio}</div>
            </div>
            
            <div className="form-floating position-relative mb-2">
                <input 
                type="password" 
                value={data.password}
                onChange={handleChange}
                name="password" 
                id="password" 
                placeholder="Password"
                ref={passwordRef}
                className="form-control" />
                <label htmlFor="password" className="form-label">Current Password</label>
                <div className="invalid-tooltip">Incorrect Password</div>
            </div>

            <small className="text-primary link" onClick={openPasswordForm}>Change password?</small>
        </form>
    )
}