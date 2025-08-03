import { useContext, useEffect, useState } from 'react';
import '../css/Footer.css';
import { SwitchPageContext } from '../contexts/SwitchPageContext';

export default function Footer() {
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

    return (
        <footer className="footer">
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