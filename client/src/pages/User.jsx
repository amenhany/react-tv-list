import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import '../css/User.css';
import { useAuth } from "../contexts/AuthContext";
import Error from "../components/Error";
import List from './List';
import Card from "../components/Card";
import { useDimmerContext } from "../contexts/DimmerContext";
import UpdateUserForm from "../components/forms/UpdateUserForm";
import ConfirmationPopUp from "../components/forms/ConfirmationPopUp";
import { SwitchPageContext } from "../contexts/SwitchPageContext";

const API_BASE = import.meta.env.VITE_API_URL;


export default function User() {
    const { isAuthenticated, user: currentUser, checkSession, requireLogin, openRegisterForm, setDimmerContent } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState({});
    const [isOwner, setIsOwner] = useState(false);
    const [user, setUser] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [userFormData, setUserFormData] = useState({
        username: currentUser?.username,
        email: currentUser?.email,
        bio: currentUser?.bio,
        password: "",
        avatar: null
    });    
    const fileInputRef = useRef();
    const passwordRef = useRef();
    const { setIsVisible, setContent } = useDimmerContext();
    const { isSwitchPage } = useContext(SwitchPageContext);

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!params.username) {
            if (isAuthenticated) navigate(`/user/${currentUser.username}`);
            else requireLogin();
            return;
        }

        document.title = `${params.username} - TV List`;

        if (params.username === currentUser?.username) {
            setUserFormData({
                username: currentUser?.username,
                email: currentUser?.email,
                bio: currentUser?.bio,
                password: "",
                avatar: null
            });
            setUser(currentUser);
            setIsOwner(true);
            setIsLoaded(true);
        }
        else {
            if (openForm) setOpenForm(false);
            setIsOwner(false);
            axios.get(`${API_BASE}/user/${params.username}`)
            .then(res => {
                setUser(res.data?.user);
                setIsLoaded(true);
            })
            .catch(err => {
                setError({ statusCode: err.status || 500, message: err.response?.data?.message || "No response" });
                setIsLoaded(true);
            });
        }
    }, [params.username, isAuthenticated, currentUser])

    function handleDeleteUser() {
        setDimmerContent(null);
        setContent(
            <ConfirmationPopUp 
                buttonText="Delete" 
                buttonColor="danger" 
                message="Are you sure you want to delete your account?"
                fn={() => {
                    axios.delete(`${API_BASE}/user/`, { withCredentials: true })
                    .then(res => {
                        checkSession();
                        navigate('/');
                        openRegisterForm();
                    });
                }} />
        );
        setIsVisible(true);
    }

    function handleOpenForm() {
        if (isOwner) {
            setDisableSubmit(false);
            setOpenForm(true);
        }
    }

    function handleCloseForm() {
        setUserFormData({
            username: currentUser.username,
            email: currentUser.email,
            bio: currentUser.bio,
            password: "",
            avatar: null
        });
        fileInputRef.current.value = "";
        setOpenForm(false);
    }

    function handleUpdateUser() {
        setDisableSubmit(true);
        axios.patch(`${API_BASE}/user/`, { ...userFormData }, { withCredentials: true, 
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(res => {
                passwordRef.current.classList.remove('is-invalid');
                navigate(`/user/${userFormData.username}`);
                checkSession();
                handleCloseForm();
            })
            .catch(err => {
                setDisableSubmit(false);
                if (err.status === 400 && err.response?.data?.errors?.password) {
                    passwordRef.current.classList.add("is-invalid");
                } else {
                    console.error("Error: ", err);
                }
            });
    }

    function handleFileChange(evt) {
        const file = evt.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            evt.target.classList.add('is-invalid');
            evt.target.value = "";
            return;
        }
        evt.target.classList.remove('is-invalid');
        setUserFormData({ ...userFormData, avatar: evt.target.files[0] });
    }


    if (user && isLoaded) {
        return (
            <div className="page-container container-fluid d-flex flex-md-row flex-column">
                <div className={"col-12 col-md-4 col-lg-3 d-flex mt-5 mb-4"  + (isSwitchPage ? " animate" : "")}>
                    <Card header={
                        <div className="d-flex justify-content-center selectDisable position-relative">
                            <input ref={fileInputRef} onChange={handleFileChange} type="file" name="upload" className="d-none" accept="image/*" />
                            <div className="invalid-tooltip">File too large!</div>
                            <div className={"d-flex justify-content-center profile-picture-wrapper" + (openForm ? " edit-picture" : "")}
                                onClick={openForm ? () => fileInputRef.current.click() : () => {}}>
                                <img src={(userFormData.avatar && URL.createObjectURL(userFormData.avatar)) || user.avatar?.url || "/imgs/no-pfp.jpg"} 
                                    className="profile-picture" />
                                <svg className="edit-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.29289 3.70711L1 11V15H5L12.2929 7.70711L8.29289 3.70711Z"></path> <path d="M9.70711 2.29289L13.7071 6.29289L15.1716 4.82843C15.702 4.29799 16 3.57857 16 2.82843C16 1.26633 14.7337 0 13.1716 0C12.4214 0 11.702 0.297995 11.1716 0.828428L9.70711 2.29289Z"></path> </g></svg>
                           </div>
                        </div>
                    } 
                    footer={ isOwner &&
                        <div className="d-flex mt-2 mb-2 justify-content-between">
                            { openForm ? 
                            <>
                                <button className="btn btn-primary me-2" onClick={handleUpdateUser} disabled={disableSubmit}>Update Profile</button>
                                <button onClick={handleCloseForm} className="btn btn-outline-secondary ms-2">Cancel</button>
                            </> : 
                            <>
                                <button className="btn btn-primary me-2" onClick={handleOpenForm}>Edit Profile</button>
                                <button className="btn btn-danger ms-2" onClick={handleDeleteUser}>Delete Account</button>
                            </>}
                        </div>
                    }>{ openForm ? <UpdateUserForm data={userFormData} setData={setUserFormData} passwordRef={passwordRef} /> : 
                        <div className="me-3 ms-1 mt-0">
                            <h5>{user.username}</h5>
                            <p className="text-body-secondary mt-2 mb-2">{user.bio}</p>
                            <small className="text-body-tertiary">Member since {user.createdAt.split('T')[0].split('-').reverse().join('/')}</small>
                        </div>
                    }
                    </Card>
                </div>
                <div className="col-12 col-md-8 col-lg-9">
                    <List user={user} />
                </div>
            </div>
        )
    } else if (isLoaded && error) {
        return <Error text={error.message} statusCode={error.statusCode} />
    } else {
        return <></>
    }
    
}