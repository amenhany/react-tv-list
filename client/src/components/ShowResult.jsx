import { useContext, useEffect, useState } from 'react';
import '../css/ShowResult.css'
import { SwitchPageContext } from '../contexts/SwitchPageContext';

export default function ShowResult({ show, preview, index }) {
    const { isSwitchPage } = useContext(SwitchPageContext);
    const [isAnimationEnd, setIsAnimationEnd] = useState(false);

    useEffect(() => {
        setIsAnimationEnd(false);
    }, [show])

    // Staggered animation, values from the css file
    useEffect(() => {
        // console.log(show.name + " " + index);
        setTimeout(() => {
            setIsAnimationEnd(true);
        }, 490 + 75*index);
    }, [isAnimationEnd])

    const year = show.premiered ? show.premiered.slice(0, 4) : "";
    const image = show.image ? show.image.medium : "/imgs/no-img-portrait-text.png"

    return (
        <div className={ "show-result" + (isSwitchPage ? " animate" : "") + (isAnimationEnd ? " show" : "") }
             onClick={() => preview(show)}
             style={{ "--i": index }} >
            <img src={image} alt={show.name + " Image"} />
            <p>{show.name}{show.premiered && ` (${year})`}</p>
        </div>
    )
}