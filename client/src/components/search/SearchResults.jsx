import '../../css/SearchResults.css'
import { useContext } from "react";
import { Results } from "../../pages/Search";
import ShowResult from "./ShowResult";
import ShowPreview from './ShowPreview';
import { DimmerContext } from '../../contexts/DimmerContext';
import { useAuth } from '../../contexts/AuthContext';


export default function SearchResults() {
    const results = useContext(Results);
    const { setIsVisible, setContent } = useContext(DimmerContext);
    const { setDimmerContent } = useAuth();

    function changePreviewShow(show) {
        setDimmerContent(null);
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