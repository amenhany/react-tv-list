import '../../css/SearchResults.css'
import { useContext } from "react";
import { Results } from "../../pages/Search";
import ShowResult from "./ShowResult";


export default function SearchResults() {
    const results = useContext(Results);

    return (
        <>
            <section className="search-results-container container-lg mt-4 selectDisable">
                {results.map((result, index) => (
                    <ShowResult key={result.show.id} show={result.show} index={index} />
                ))}
            </section>
        </>
    )
}