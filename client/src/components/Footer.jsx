import { useContext, useEffect, useState } from 'react';
import '../css/Footer.css';
import { SwitchPageContext } from '../contexts/SwitchPageContext';
import { useLocation } from 'react-router-dom';

export default function Footer({ force }) {
    const location = useLocation();
    const [isLoaded, setIsLoaded] = useState(false);
    const { isSwitchPage } = useContext(SwitchPageContext);

    useEffect(() => {
        setIsLoaded(false);
        const timeout = setTimeout(() => {
            setIsLoaded(true);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [isSwitchPage]);

    if (!isLoaded) return <></>;
    if (!force && location.pathname === '/') return <></>;

    return (
        <footer className="footer" data-bs-theme={force && 'dark'}>
            <div className="footer-content">
                <div className="footer-left">
                    <p>&copy; 2025 TV List</p>
                </div>
                <div className="footer-right">
                    <a href="https://github.com/amenhany/react-tv-list">GitHub</a>
                    <a href="https://linkedin.com/in/amen-hany/">Linkedin</a>
                </div>
            </div>
        </footer>
    )
}