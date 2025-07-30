import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext"
import { useDimmerContext } from "../../contexts/DimmerContext";
import { SwitchPageContext } from "../../contexts/SwitchPageContext";
import ConfirmationPopUp from "../forms/ConfirmationPopUp";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";

const API_BASE = import.meta.env.VITE_API_URL;


export default function NavMenu() {
    const { isAuthenticated, user, checkSession, openLoginForm, openRegisterForm } = useAuth();
    const { setIsVisible, setContent, content } = useDimmerContext();
    const { isSwitchPage, setIsSwitchPage } = useContext(SwitchPageContext);
    const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

    const navigate = useNavigate();
    const menuRef = useRef();
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(closeMenu, [isSwitchPage, content])

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                closeMenu();
            }
        }

        if (openMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenu, setOpenMenu]);

    function closeMenu() {
        menuRef.current.classList.add('animate');
        const timeout = setTimeout(() => {
            setOpenMenu(false);
            menuRef.current.classList.remove('animate');
        }, 280)
    }

    function logOut() {
        setContent(
            <ConfirmationPopUp 
                buttonText="Log Out" 
                buttonColor="primary" 
                message="Are you sure you want to log out?"
                fn={() => {
                    axios.get(`${API_BASE}/user/logout`, { withCredentials: true })
                    .then(checkSession);
                    setIsVisible(false);
            }} />
        );
        setIsVisible(true);
    }

    function handleOpenMenu() {
        if (openMenu) {
            closeMenu();
        }

        setOpenMenu(true);
    }

    function goTo(url) {
        setIsSwitchPage(true);
        setTimeout(() => {
            navigate(url);
            setIsSwitchPage(false);
        }, 300);
    }

    return (
        <>
        {isAuthenticated ? 
            <div className="avatar-icon-container ms-3 selectDisable" onClick={handleOpenMenu}>
                <img src={user.avatar?.url || "/imgs/no-pfp.jpg"} className="avatar-icon" />
            </div>
        :<>
            <button className="d-none d-md-inline btn btn-outline-light ms-3 text-nowrap" onClick={openLoginForm}>Log In</button>
            <button className="d-none d-lg-inline btn btn-outline-light ms-3 text-nowrap" onClick={openRegisterForm}>Sign Up</button>
            <div className="d-block d-lg-none ms-3 selectDisable" onClick={handleOpenMenu}>
                <svg className="burger-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 7L4 7" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M20 12L4 12" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M20 17L4 17" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
            </div>
        </>
        }
        <ul className={"nav-menu selectDisable" + (openMenu ? " open" : "")} ref={menuRef}>
            {isAuthenticated ? 
            <>
                <li className="nav-menu-item" onClick={() => goTo('/list')}>
                    <svg className="nav-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.00 32.00" strokeWidth="0.00032"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M24,19V7c0-1.657-1.343-3-3-3H7C5.343,4,4,5.343,4,7v5h4v12c0,1.657,1.343,3,3,3h14 c1.657,0,3-1.343,3-3v-5H24z M8,10H6V7c0-0.551,0.449-1,1-1c0.552,0,1,0.448,1,1V10z M10,24V7c0-0.35-0.06-0.687-0.171-1H21 c0.551,0,1,0.449,1,1v12H12v5c0,0.552-0.448,1-1,1C10.449,25,10,24.551,10,24z M26,24c0,0.551-0.449,1-1,1H13.829 C13.94,24.687,14,24.35,14,24v-3h12V24z M20,12h-8v-2h8V12z M20,16h-8v-2h8V16z"></path> </g></svg>
                    <label className="ps-4">My List</label>
                </li>
                <li className="nav-menu-item" onClick={() => goTo('/user')}>
                    <svg className="nav-item-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    <label className="ps-4">My Profile</label>
                </li>
                <li className="nav-menu-item" onClick={() => setIsDarkMode(!isDarkMode)}>
                    <svg className="nav-item-icon" style={{transform: "scale(0.9)", paddingLeft: "1px"}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path> </g></svg>
                    <div className="form-check form-switch form-check-reverse d-flex justify-content-between align-items-center">
                        <label className="form-check-label ps-4">Dark Mode</label>
                        <input className="form-check-input" checked={isDarkMode} readOnly type="checkbox" />
                    </div>
                </li>
                <li className="nav-menu-item" onClick={logOut}>
                    <svg className="nav-item-icon" style={{fill: "none"}} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Log_Out"> <path id="Vector" d="M12 15L15 12M15 12L12 9M15 12H4M9 7.24859V7.2002C9 6.08009 9 5.51962 9.21799 5.0918C9.40973 4.71547 9.71547 4.40973 10.0918 4.21799C10.5196 4 11.0801 4 12.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V16.8036C20 17.9215 20 18.4805 19.7822 18.9079C19.5905 19.2842 19.2837 19.5905 18.9074 19.7822C18.48 20 17.921 20 16.8031 20H12.1969C11.079 20 10.5192 20 10.0918 19.7822C9.71547 19.5905 9.40973 19.2839 9.21799 18.9076C9 18.4798 9 17.9201 9 16.8V16.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                    <label className="ps-4">Log Out</label>
                </li>
            </>
            :
            <>
                <li className="nav-menu-item" onClick={() => setIsDarkMode(!isDarkMode)}>
                    <svg className="nav-item-icon" style={{transform: "scale(0.9)", paddingLeft: "1px"}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path> </g></svg>
                    <div className="form-check form-switch form-check-reverse d-flex justify-content-between align-items-center">
                        <label className="form-check-label ps-4">Dark Mode</label>
                        <input className="form-check-input" checked={isDarkMode} readOnly type="checkbox" />
                    </div>
                </li>
                <li className="nav-menu-item" onClick={openLoginForm}>
                    <label className="ps-4">Log In</label>
                </li>
                <li className="nav-menu-item" onClick={openRegisterForm}>
                    <label className="ps-4">Sign Up</label>
                </li>
            </>
            }
        </ul>
        </>
    )
}