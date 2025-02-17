import '../../public/css/SearchResults.css'
import { useContext } from "react";
import { Results } from "../pages/Search";
import ShowResult from "./ShowResult";


export default function SearchResults() {
    const results = useContext(Results);
    console.log(results);

    return (
        <section className="search-results-container container mt-4 selectDisable">
            {results.map(result => (
                <ShowResult key={result.show.id} show={result} />
            ))}
        </section>
    )
}