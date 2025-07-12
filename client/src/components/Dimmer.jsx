import CloseButton from "./CloseButton";
import "../css/Dimmer.css";
import { createContext, useContext, useEffect, useState } from "react";
import { SwitchPageContext } from '../contexts/SwitchPageContext';

export const isDimmerVisible = createContext(true);

export default function Dimmer({ close, children }) {
    const [isAnimationActive, setIsAnimationActive] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const { isSwitchPage } = useContext(SwitchPageContext);


    function closeDimmer() {
        document.body.classList.remove("stop-scroll");
        setIsVisible(false);
        setIsAnimationActive(true);
    }

    function onAnimationEnd() {
        setIsAnimationActive(false);
        if (!isVisible) close();
    }


    function handleDimmerClick(e) {
        const tag = e.target.tagName;
        const safeTags = ["IMG", "H1", "H2", "H3", "H4", "P", "BUTTON", "INPUT", "TEXTAREA", "A", "LABEL", "SPAN"];

        // If user clicked on actual content, do NOT close
        if (safeTags.includes(tag)) return;

        closeDimmer();
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            const keyName = event.key;
            if (keyName === 'Escape') {
                closeDimmer();
            }
        }

        document.body.classList.add("stop-scroll");
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        if (isSwitchPage) closeDimmer();
    }, [isSwitchPage])

    return (
        <isDimmerVisible.Provider value={isVisible}>
            <div className={"dimmer" + (isAnimationActive ? " animate" : "")}
                onAnimationEnd={onAnimationEnd}
                onClick={handleDimmerClick}>
                <CloseButton closeDimmer={closeDimmer} />
                { children }
            </div>
        </isDimmerVisible.Provider>
    )
}