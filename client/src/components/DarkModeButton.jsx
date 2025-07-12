import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';


export default function DarkModeButton() {
    const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
    const image = isDarkMode ? "/imgs/sun_icon.svg" : "/imgs/moon_icon.svg";

    function toggleTheme() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div id="btn_darkmode" onClick={toggleTheme}>
            <img src={image} className="icon-link nav-button bi bi-moon selectDisable" />
        </div>
    )
}