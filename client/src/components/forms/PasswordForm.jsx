import axios from "../../js/axios.js";
import { useEffect, useState } from "react";
import { useDimmerContext } from "../../contexts/DimmerContext";
import Card from "../Card";
import { useAuth } from "../../contexts/AuthContext";
import PasswordInput from "../PasswordInput";


export default function PasswordForm() {
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: "",
        password: "",
        confirmPassword: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const { checkSession } = useAuth();
    const { setIsVisible } = useDimmerContext();


    useEffect(() => {
        const debounce = setTimeout(() => {
            axios.post(`/user/check-data`, { ...passwordFormData })
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

        axios.patch(`/user/change-password`, passwordFormData, { withCredentials: true })
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
                <div className="mb-3">
                    <PasswordInput 
                        name="currentPassword" 
                        display="Current Password"
                        value={passwordFormData.currentPassword}
                        change={handleChange}
                        error={formErrors.currentPassword}
                        validFeedback={false}
                    />
                </div>
                <div className="mb-3">
                    <PasswordInput 
                        name="password" 
                        display="New Password"
                        value={passwordFormData.password}
                        change={handleChange}
                        error={formErrors.password}
                        validFeedback={true}
                    />
                </div>
                <div>
                    <PasswordInput 
                        name="confirmPassword" 
                        display="Confirm Password"
                        value={passwordFormData.confirmPassword}
                        change={handleChange}
                        error={formErrors.confirmPassword}
                        validFeedback={true}
                    />
                </div>
            </form>
        </Card>
    )
}