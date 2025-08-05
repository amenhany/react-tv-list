import { useEffect, useState } from "react";
import { useDimmerContext } from "../../contexts/DimmerContext";
import PasswordForm from "./PasswordForm";
import axios from "../../js/axios.js";
import PasswordInput from "../PasswordInput";


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
            axios.patch(`/user/check-data`, { ...dataToCheck }, { withCredentials: true })
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
                <label htmlFor="username" className="form-label label-icon">Username</label>
                <div className="invalid-tooltip">{formErrors?.username}</div>
                <svg className="input-icon selectDisable" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
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
                <label htmlFor="email" className="form-label label-icon">Email</label>
                <div className="invalid-tooltip">{formErrors?.email}</div>
                <svg className="input-icon selectDisable" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M19.2 5H4.8C3.81 5 3.009 5.81 3.009 6.8L3 17.6C3 18.59 3.81 19.4 4.8 19.4H19.2C20.19 19.4 21 18.59 21 17.6V6.8C21 5.81 20.19 5 19.2 5ZM19.2 17.6H4.8V8.6L12 13.1L19.2 8.6V17.6ZM4.8 6.8L12 11.3L19.2 6.8H4.8Z" fill=""></path> </g></svg>
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

            <div className="mb-2">
                <PasswordInput 
                    name="password" 
                    display="Current Password"
                    ref={passwordRef}
                    value={data.password}
                    change={handleChange}
                    validFeedback={false}
                />
            </div>

            <small className="text-primary link" onClick={openPasswordForm}>Change password?</small>
        </form>
    )
}