import { useContext, useEffect, useState } from 'react';
import '../css/ShowResult.css'
import { SwitchPageContext } from '../contexts/SwitchPageContext';

export default function ShowResult({ show, preview, index }) {
    const { isSwitchPage } = useContext(SwitchPageContext);
    const [isAnimationEnd, setIsAnimationEnd] = useState(false);
    const [isImgLoaded, setIsImgLoaded] = useState(false);

    const year = show.premiered ? show.premiered.slice(0, 4) : "";
    const image = show.image ? show.image.medium : "/imgs/no-img-portrait-text.png"

    useEffect(() => {
        setIsAnimationEnd(false);
    }, [show])

    // Pre-load image
    useEffect(() => {
        const img = new Image();
        img.src = image;
        img.onload = () => setIsImgLoaded(true);
        img.onerror = () => setIsImgLoaded(true); // even broken image counts as loaded
    }, [image]);

    // Staggered animation, values from the css file
    useEffect(() => {
        // console.log(show.name + " " + index);
        setTimeout(() => {
            setIsAnimationEnd(true);
        }, 490 + 75*index);
    }, [isAnimationEnd])

    if (!isImgLoaded) {
        return <></>
    } else {
        return (
            <div className={ "show-result" + (isSwitchPage ? " animate" : "") + (isAnimationEnd ? " show" : "") }
                onClick={() => preview(show)}
                style={{ "--i": index }} >
                <img src={image} alt={show.name + " Image"} />
                <p>{show.name}{show.premiered && ` (${year})`}</p>
            </div>
        )
    }
}