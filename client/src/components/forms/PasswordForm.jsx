import axios from "axios";
import { useEffect, useState } from "react";
import { useDimmerContext } from "../../contexts/DimmerContext";
import Card from "../Card";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL;


export default function PasswordForm() {
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: "",
        password: "",
        confirmPassword: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [isFirstInput, setIsFirstInput] = useState({
        password: true,
        confirmPassword: true
    });
    const { checkSession } = useAuth();
    const { setIsVisible } = useDimmerContext();


    useEffect(() => {
        const debounce = setTimeout(() => {
            axios.post(`${API_BASE}/user/check-data`, { ...passwordFormData })
            .then(res => setFormErrors({}))
            .catch(err => {
                const { password, confirmPassword } = err.response?.data?.errors;
                setFormErrors({ password, confirmPassword });
            });
        }, 500);
        
        return () => clearTimeout(debounce);
    }, [passwordFormData])

    function handleChange(evt) {
        const fieldName = evt.target.name;
        const value = evt.target.value;

        setPasswordFormData(currData => {
            currData[fieldName] = value;
            return {...currData};
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsFirstInput(prev => Object.fromEntries(Object.keys(prev).map(key => [key, false])));

        axios.patch(`${API_BASE}/user/change-password`, passwordFormData, { withCredentials: true })
        .then(res => {
            checkSession();
            setIsVisible(false);
        })
        .catch(err => setFormErrors(err.response?.data?.errors));
    }

    function handleCancel() {
        setIsVisible(false);
    }

    return (
        <Card title="Change Password"
        footer={
            <div className="d-flex justify-content-between mt-2 mb-2">
                <button onClick={handleSubmit} className="btn btn-success me-2">Change Password</button>
                <button onClick={handleCancel} className="btn btn-outline-secondary ms-2">Cancel</button>
            </div>
            }>
            <form className="needs-validation" noValidate onSubmit={evt => evt.preventDefault()}>
                <div className="form-floating mb-3">
                    <input 
                    type="password" 
                    value={passwordFormData.currentPassword}
                    onChange={handleChange}
                    name="currentPassword" 
                    id="currentPassword" 
                    placeholder="Current Password"
                    className={"form-control" + (formErrors.currentPassword ? " is-invalid" : "")} />
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <div className="invalid-tooltip">Incorrect Password</div>
                </div>

                <div className="form-floating mb-3">
                    <input 
                    type="password" 
                    value={passwordFormData.newPassword}
                    onChange={handleChange}
                    name="password" 
                    id="password" 
                    placeholder="New Password"
                    onBlur={() => setIsFirstInput({...isFirstInput, password: false})}
                    className={"form-control" + (isFirstInput.password ? "" : (formErrors.password ? " is-invalid" : " is-valid"))} />
                    <label htmlFor="password" className="form-label">New Password</label>
                    <div className="invalid-tooltip">{formErrors.password}</div>
                </div>
                
                <div className="form-floating mb-2">
                    <input 
                    type="password" 
                    value={passwordFormData.confirmPassword}
                    onChange={handleChange}
                    name="confirmPassword" 
                    id="confirmPassword" 
                    placeholder="Confirm Password"
                    onBlur={() => setIsFirstInput({...isFirstInput, confirmPassword: false})}
                    className={"form-control" + ((isFirstInput.confirmPassword || formErrors.password) ? "" : (formErrors.confirmPassword ? " is-invalid" : " is-valid"))} />
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <div className="invalid-tooltip">{formErrors.confirmPassword}</div>
                </div>
            </form>
        </Card>
    )
}