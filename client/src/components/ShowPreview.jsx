import { useContext } from 'react';
import "../../public/css/ShowPreview.css";
import ShowPreviewForm from "./ShowPreviewForm";
import { isDimmerVisibleContext } from './Dimmer';


export default function ShowPreview({ selected }) {
    const isVisible = useContext(isDimmerVisibleContext);

    const image = selected.show.image ? selected.show.image.original : "../../public/imgs/no-img-portrait-text.png"

    let info = `Rating: ${selected.show.rating.average || '-'}/10, Language: ${selected.show.language}`;
    if (selected.show.premiered) {
        const dateArr = selected.show.premiered.split('-');
        const date = `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
        info += `, Premiered: ${date}`;
    }

    return (
        <div className={"container show-preview" + (!isVisible ? " animate" : "") }>
            <div className="row align-items-center">
                <img src={image} alt="" className="col-6 col-lg-4 show-preview-img selectDisable" />
                <div className="col-6 col-lg-8">
                    <h1 className="show-preview-title">{ selected.show.name }</h1>
                    <h2 className="show-preview-genre">
                        { selected.show.genres.join(", ") }
                    </h2>
                    <h3 className="show-preview-info">
                        { info }
                    </h3>
                    <div className="show-preview-description" dangerouslySetInnerHTML={
                        { __html: selected.show.summary }
                    }></div>
                    <h3 className="show-preview-runtime">
                        { `Average Runtime: ${selected.show.averageRuntime ? selected.show.averageRuntime
                            + ' minutes' : 'Unknown'}, Status: ${selected.show.status}` }
                    </h3>
                    <ShowPreviewForm show={ selected } />
                </div>
            </div>
        </div>
    )
}