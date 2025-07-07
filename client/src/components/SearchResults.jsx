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
        setPreviewShow(show);
        setIsDimmer(true);
    }

    function closeDimmer() {
        setIsDimmer(false);
    }

    return (
        <>
            <section className="search-results-container container mt-4 selectDisable">
                {results.map((result, index) => (
                    <ShowResult key={result.show.id} show={result} preview={changePreviewShow} index={index} />
                ))}
            </section>

            { isDimmer &&
                <Dimmer close={closeDimmer}>
                    <ShowPreview selected={previewShow} />
                </Dimmer>
            }
        </>
    )
}