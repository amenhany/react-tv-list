import '../css/SearchResults.css'
import { useContext, useState } from "react";
import { Results } from "../pages/Search";
import ShowResult from "./ShowResult";
import Dimmer from './Dimmer';
import ShowPreview from './ShowPreview';


export default function SearchResults() {
    const results = useContext(Results);
    
    const [previewShow, setPreviewShow] = useState({});
    const [isDimmer, setIsDimmer] = useState(false);

    function changePreviewShow(show) {
        const imageURL = show.image?.original;

        if (!imageURL) {
            setPreviewShow(show);
            setIsDimmer(true);
            return;
        }

        const img = new Image();
        img.src = imageURL;
        img.onload = () => {
            setPreviewShow(show);
            setIsDimmer(true);
        };
    }

    function closeDimmer() {
        setIsDimmer(false);
    }

    return (
        <>
            <section className="search-results-container container-lg mt-4 selectDisable">
                {results.map((result, index) => (
                    <ShowResult key={result.show.id} show={result.show} preview={changePreviewShow} index={index} />
                ))}
            </section>

            { isDimmer &&
                <Dimmer close={closeDimmer}>
                    <ShowPreview show={previewShow} />
                </Dimmer>
            }
        </>
    )
}