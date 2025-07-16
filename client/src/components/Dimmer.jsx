import CloseButton from "./CloseButton";
import "../css/Dimmer.css";
import { createContext, useContext, useEffect, useState } from "react";
import { SwitchPageContext } from '../contexts/SwitchPageContext';
import { DimmerContext } from "../contexts/DimmerContext";

export const isDimmerVisible = createContext(true);

export default function Dimmer() {
    const { isSwitchPage } = useContext(SwitchPageContext);
    const { isVisible, setIsVisible, content } = useContext(DimmerContext);

    const [isAnimationActive, setIsAnimationActive] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [currentContent, setCurrentContent] = useState(content);
    const [contentFadeClass, setContentFadeClass] = useState('fade-in');


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
        else if (!isVisible && isActive) {
            closeDimmer();
        }
    }, [isVisible]);

    useEffect(() => {
        if (isSwitchPage && isActive) closeDimmer();
    }, [isSwitchPage])


    if (!isVisible && !isAnimationActive && !isActive) return null;

    return (
        <div className={"dimmer" + (isAnimationActive ? " animate" : "")}
            onAnimationEnd={onAnimationEnd}
            onClick={handleDimmerClick}>
            <CloseButton closeDimmer={closeDimmer} />
            { content }
        </div>
    )
}