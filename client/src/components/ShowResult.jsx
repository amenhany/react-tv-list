import { useContext } from 'react';
import '../../public/css/ShowResult.css'
import { SwitchPage } from '../App';

export default function ShowResult({ show: result, preview }) {
    const { isSwitchPage } = useContext(SwitchPage);

    const year = result.show.premiered ? result.show.premiered.slice(0, 4) : "";
    const image = result.show.image ? result.show.image.medium : "../../public/imgs/no-img-portrait-text.png"

    return (
        <div className={ "show-result" + (isSwitchPage ? " animate" : "") } onClick={() => preview(result)}>
            <img src={image} alt={result.show.name + " Image"} />
            <p>{result.show.name}{result.show.premiered && ` (${year})`}</p>
        </div>
    )
}