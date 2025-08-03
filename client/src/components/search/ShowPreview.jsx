import { useContext, useEffect, useRef, useState } from 'react';
import "../../css/ShowPreview.css";
import ShowPreviewForm from "./ShowPreviewForm";
import { isDimmerVisible } from '../Dimmer';


export default function ShowPreview({ show }) {
    const [readMore, setReadMore] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const isVisible = useContext(isDimmerVisible);

    const image = show.image ? show.image.original : "/imgs/no-img-portrait-text.png"

    let info = `Rating: ${show.rating.average || '-'}/10, Language: ${show.language}`;
    if (show.premiered) {
        const dateArr = show.premiered.split('-');
        const date = `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
        info += `, Premiered: ${date}`;
    }

    useEffect(() => {
        const summary = document.querySelectorAll('.show-preview-description p');
        if (summary.length && (summary[0].scrollHeight !== summary[0].clientHeight || summary.length > 1)) {
            setShowReadMore(true);
        }
    }, [])

    return (
        <div className={"container-lg container-fluid show-preview" + (!isVisible ? " animate" : "") }>
            <div className="row justify-content-center align-items-center">
                <img src={image} alt="" className="col-12 col-md-4 show-preview-img selectDisable" />
                <div className="col-12 col-md-8">
                    <h1 className="show-preview-title">{ show.name }</h1>
                    <h2 className="show-preview-genre">
                        { show.genres.join(", ") }
                    </h2>
                    <h3 className="show-preview-info">
                        { info }
                    </h3>
                    <div className="show-preview-description" data-no-close="true">
                        <div className={readMore ? "read-more" : "read-less"} dangerouslySetInnerHTML={{ __html: show.summary }} />
                        {showReadMore &&
                            <b onClick={() => setReadMore(!readMore)} className="clickable selectDisable">
                                {readMore ? 'Read Less...' : 'Read More...'}
                            </b>
                        }
                    </div>
                    <h3 className="show-preview-runtime">
                        { `Average Runtime: ${show.averageRuntime ? show.averageRuntime
                            + ' minutes' : 'Unknown'}, Status: ${show.status}` }
                    </h3>
                    <ShowPreviewForm show={ show } />
                </div>
            </div>
        </div>
    )
}