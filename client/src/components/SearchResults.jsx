import '../css/SearchResults.css'
import { useContext, useState } from "react";
import { Results } from "../pages/Search";
import ShowResult from "./ShowResult";
import ShowPreview from './ShowPreview';
import { DimmerContext } from '../contexts/DimmerContext';


export default function SearchResults() {
    const results = useContext(Results);
    const { setIsVisible, setContent } = useContext(DimmerContext);

    function changePreviewShow(show) {
        const imageURL = show.image?.original;

        if (!imageURL) {
            setContent(<ShowPreview show={show} />);
            setIsVisible(true);
            return;
        }

        const img = new Image();
        img.src = imageURL;
        img.onload = () => {
            setContent(<ShowPreview show={show} />);
            setIsVisible(true);
        };
    }

    return (
        <>
            <section className="search-results-container container-lg mt-4 selectDisable">
                {results.map((result, index) => (
                    <ShowResult key={result.show.id} show={result.show} preview={changePreviewShow} index={index} />
                ))}
            </section>
        </>
    )
}