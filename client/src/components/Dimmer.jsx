import CloseButton from "./CloseButton";
import "../css/Dimmer.css";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { SwitchPageContext } from '../contexts/SwitchPageContext';
import { useDimmerContext } from "../contexts/DimmerContext";


function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}


export const isDimmerVisible = createContext(true);

export default function Dimmer() {
    const { isSwitchPage } = useContext(SwitchPageContext);
    const { isVisible, setIsVisible, content } = useDimmerContext();

    const [isAnimationActive, setIsAnimationActive] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [currentContent, setCurrentContent] = useState(content);

    const contentRef = useRef();
    const previousVisibility = usePrevious(isVisible);


    function closeDimmer() {
        document.body.classList.remove("stop-scroll");
        document.querySelector('.list-container')?.removeAttribute('inert');
        setIsActive(false);
        setIsAnimationActive(true);
    }

    function onAnimationEnd() {
        setIsAnimationActive(false);
        if (!isActive) setIsVisible(false);
    }


    function handleDimmerClick(e) {
        const tag = e.target.tagName;
        const safeTags = ["IMG", "H1", "H2", "H3", "H4", "P", "BUTTON", "INPUT", "TEXTAREA", "A", "LABEL", "SPAN"];
        if (safeTags.includes(tag)) return;

        let cur = e.target;

        while (cur) {
            if (cur.dataset && cur.dataset.noClose) {
                return;
            }
            cur = cur.parentElement;
        }

        closeDimmer();
    }

    const handleKeyDown = (event) => {
        const keyName = event.key;
        if (keyName === 'Escape') {
            closeDimmer();
        }
    }

    useEffect(() => {
        if (isVisible) {
            setIsActive(true);
            setIsAnimationActive(false);
            document.addEventListener('keydown', handleKeyDown);
            document.body.classList.add("stop-scroll");
            document.querySelector('.list-container')?.setAttribute('inert', '');
        }
        else if (!isVisible && isActive) {
            document.removeEventListener('keydown', handleKeyDown);
            closeDimmer();
        }

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible]);

    useEffect(() => {
        if (contentRef.current && content !== currentContent && isVisible === previousVisibility) {
            contentRef.current.classList.add('animate');
            const timeout = setTimeout(() => {
                setCurrentContent(content);
                contentRef.current.classList.remove('animate');
            }, 280)
            return () => clearTimeout(timeout);
        }
        else {
            setCurrentContent(content);
        }
    }, [content])

    useEffect(() => {
        if (isSwitchPage && isActive) closeDimmer();
    }, [isSwitchPage])


    if (!isVisible && !isAnimationActive && !isActive) return null;

    return (
        <div className={"dimmer" + (isAnimationActive ? " animate" : "")}
            onAnimationEnd={onAnimationEnd}
            onClick={handleDimmerClick}>
            <CloseButton closeDimmer={closeDimmer} />
            <div className="content-wrapper" ref={contentRef}>
                { currentContent }
            </div>
        </div>
    )
}