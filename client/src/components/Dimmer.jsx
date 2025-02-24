import CloseButton from "./CloseButton";
import "../../public/css/Dimmer.css";
import { createContext, useEffect, useState } from "react";

export const isDimmerVisibleContext = createContext(true);

export default function Dimmer({ close, children }) {
    const [isAnimationActive, setIsAnimationActive] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    function closeDimmer() {
        document.body.classList.remove("stop-scroll");
        setIsVisible(false);
        setIsAnimationActive(true);
    }

    function onAnimationEnd() {
        setIsAnimationActive(false);
        if (!isVisible) close();
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

    return (
        <isDimmerVisibleContext.Provider value={isVisible}>
            <div className={"dimmer" + (isAnimationActive ? " animate" : "")}
                onAnimationEnd={onAnimationEnd}>
                <CloseButton closeDimmer={closeDimmer} />
                { children }
            </div>
        </isDimmerVisibleContext.Provider>
    )
}