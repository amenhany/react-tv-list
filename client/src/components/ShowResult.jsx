import { useContext, useEffect, useState } from 'react';
import '../css/ShowResult.css'
import { SwitchPageContext } from '../contexts/SwitchPageContext';

export default function ShowResult({ show: result, preview, index }) {
    const { isSwitchPage } = useContext(SwitchPageContext);
    const [isAnimationEnd, setIsAnimationEnd] = useState(false);

    useEffect(() => {
        setIsAnimationEnd(false);
    }, [result])

    // Staggered animation, values from the css file
    useEffect(() => {
        // console.log(result.show.name + " " + index);
        setTimeout(() => {
            setIsAnimationEnd(true);
        }, 490 + 75*index);
    }, [isAnimationEnd])

    const year = result.show.premiered ? result.show.premiered.slice(0, 4) : "";
    const image = result.show.image ? result.show.image.medium : "/imgs/no-img-portrait-text.png"

    return (
        <div className={ "show-result" + (isSwitchPage ? " animate" : "") + (isAnimationEnd ? " show" : "") }
             onClick={() => preview(result)}
             style={{ "--i": index }} >
            <img src={image} alt={result.show.name + " Image"} />
            <p>{result.show.name}{result.show.premiered && ` (${year})`}</p>
        </div>
    )
}