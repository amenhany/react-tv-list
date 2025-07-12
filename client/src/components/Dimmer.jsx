import CloseButton from "./CloseButton";
import "../css/Dimmer.css";
import { createContext, useContext, useEffect, useState } from "react";
import { SwitchPageContext } from '../contexts/SwitchPageContext';
import { DimmerContext } from "../contexts/DimmerContext";

export const isDimmerVisible = createContext(true);

export default function Dimmer() {
    const [isAnimationActive, setIsAnimationActive] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const { isSwitchPage } = useContext(SwitchPageContext);
    const { isVisible, setIsVisible, content } = useContext(DimmerContext);


    function closeDimmer() {
        document.body.classList.remove("stop-scroll");
        setIsActive(false);
        setIsAnimationActive(true);
    }

    function onAnimationEnd() {
        setIsAnimationActive(false);
        if (!isActive) setIsVisible(false);
    }


    function handleDimmerClick(e) {
        const tag = e.target.tagName;
        const safeTags = ["IMG", "H1", "H2", "H3", "H4", "P", "BUTTON", "INPUT", "TEXTAREA", "A", "LABEL", "SPAN", "FORM"];

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
        if (isVisible) {
            setIsActive(true);
            setIsAnimationActive(false);
            document.body.classList.add("stop-scroll");
        }
    }, [isVisible]);

    useEffect(() => {
        if (isSwitchPage) closeDimmer();
    }, [isSwitchPage])


    if (!isVisible) return null;

    return (
        <div className={"dimmer" + (isAnimationActive ? " animate" : "")}
            onAnimationEnd={onAnimationEnd}
            onClick={handleDimmerClick}>
            <CloseButton closeDimmer={closeDimmer} />
            { content }
        </div>
    )
}