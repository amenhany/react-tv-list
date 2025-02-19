import { useContext } from 'react';
import { Theme } from '../App';


export default function DarkModeButton() {
    const { isDarkMode, setIsDarkMode } = useContext(Theme);
    const image = isDarkMode ? "../../public/imgs/sun_icon.svg" : "../../public/imgs/moon_icon.svg";

    function toggleTheme() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div id="btn_darkmode" onClick={toggleTheme}>
            <img src={image} className="icon-link nav-button bi bi-moon selectDisable" />
        </div>
    )
}