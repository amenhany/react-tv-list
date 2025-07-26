import { useContext, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { DimmerContext } from "../../contexts/DimmerContext";
import Card from "../Card";

export default function PasswordForm() {
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isFirstInput, setIsFirstInput] = useState(true);
    const { setIsVisible } = useContext(DimmerContext);

    function handleChange(evt) {
        const fieldName = evt.target.name;
        const value = evt.target.value;

        setPasswordFormData(currData => {
            currData[fieldName] = value;
            return {...currData};
        })

        if (isFirstInput && evt.target.name === "confirmPassword") {
            setIsFirstInput(false);
        }
    }

    function handleSubmit() {

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
            <div className="d-flex flex-column container">
                <label htmlFor="currentPassword">Current Password</label>
                <input 
                type="password" 
                value={passwordFormData.currentPassword}
                onChange={handleChange}
                name="currentPassword" 
                id="currentPassword" 
                className="form-control me-1 mb-3" />

                <label htmlFor="newPassword">New Password</label>
                <input 
                type="password" 
                value={passwordFormData.newPassword}
                onChange={handleChange}
                name="newPassword" 
                id="newPassword" 
                className="form-control me-1 mb-3" />

                <label htmlFor="confirmPassword">Confirm Password</label>
                <input 
                type="password"  
                value={passwordFormData.confirmPassword}
                onChange={handleChange}
                name="confirmPassword" 
                id="confirmPassword" 
                className="form-control me-1 mb-1" />
            </div>
        </Card>
    )
}