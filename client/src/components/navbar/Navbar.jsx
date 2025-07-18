import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { SwitchPageContext } from '../../contexts/SwitchPageContext';
import '../../css/Navbar.css'
import DarkModeButton from './DarkModeButton';
import Searchbar from './Searchbar';
import AuthenticatedElement from './AuthenticatedElement';

export default function Navbar() {
    const navigate = useNavigate();
    const { setIsSwitchPage } = useContext(SwitchPageContext);
    
    function handleHomeButton() {
        setIsSwitchPage(true);
        setTimeout(() => {
            setIsSwitchPage(false);
            navigate("/");
        }, 300);
    }

    return (
        <>
            <nav className="navbar navbar-expand-md purple-nav navbar-dark fixed-top">
                <div className="container-fluid">
                    <div className="col-4">
                        <a className="navbar-brand home-button ms-1 selectDisable" onClick={handleHomeButton}>
                            <img src="/imgs/tv.png" alt="TV icon" width="30" height="30" className="pt-0 me-1 d-inline-block align-text-top" />
                            <span className="d-none d-md-inline"> TV Series</span>
                        </a>
                    </div>
                    <div className="col-xl-4 col-md-6 col-sm-7 col-8 position-absolute top-50 start-50 translate-middle">
                        <Searchbar />
                    </div>
                    <div className="col-2 d-flex justify-content-end me-1 align-items-center">
                        <DarkModeButton />
                        <AuthenticatedElement />
                    </div>
                </div>
            </nav>
        </>
    )
}