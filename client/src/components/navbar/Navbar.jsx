import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { SwitchPageContext } from '../../contexts/SwitchPageContext';
import '../../css/Navbar.css'
import DarkModeButton from './DarkModeButton';
import Searchbar from './Searchbar';
import NavMenu from './NavMenu';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsSwitchPage } = useContext(SwitchPageContext);
    const { isAuthenticated } = useAuth();
    
    function handleHomeButton() {
        if (location.pathname !== '/') {
            setIsSwitchPage(true);
            setTimeout(() => {
                setIsSwitchPage(false);
                navigate("/");
            }, 300);
        }
    }

    return (
        <>
            <nav className={"navbar navbar-expand-md purple-nav navbar-dark fixed-top" + (location.pathname === "/" ? "" : " active")}>
                <div className="container-fluid">
                    <div className="col-4 d-flex align-items-center">
                        <a className="navbar-brand home-button ms-1 selectDisable pt-0 pb-0" onClick={handleHomeButton}>
                            <img src="/imgs/tv.png" alt="TV icon" width="28" height="32" className="pt-0 pb-1 me-1 d-inline-block align-text-top" />
                            <span className="d-none d-md-inline"> TV List</span>
                        </a>
                    </div>
                    { location.pathname !== "/" &&
                    <div className="col-xl-4 col-md-6 col-sm-7 col-8 position-absolute top-50 start-50 translate-middle">
                        <Searchbar />
                    </div>
                    }
                    <div className="col-2 d-none d-lg-flex justify-content-end me-1 align-items-center position-relative"
                        style={{ paddingRight: isAuthenticated ? "42px" : "175px" }}>
                        <DarkModeButton />
                    </div>
                </div>
            </nav>
            { location.pathname !== "/" && 
            <div className="nav-menu-wrapper">
                <NavMenu />
            </div>
            }
        </>
    )
}