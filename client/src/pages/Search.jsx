import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import SearchResults from '../components/SearchResults'
import Error from '../components/Error'
import { useSearchParams } from 'react-router-dom';


export const Results = createContext();

export default function Search() {
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get("q");

    // I made the displayed search term a state depending on the search term instead of using the search term
    // directly so that the heading only updates when the data is returned, instead of flashing the wrong heading
    const [searchResults, setSearchResults] = useState([]);
    const [displayedSearchTerm, setDisplayedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const config = { params: { q: searchTerm } }
        axios.get("http://localhost:3000/search", config)
        .then(res => {
            setSearchResults(res.data);
            setDisplayedSearchTerm(searchTerm);
        })
    }, [searchParams])

    const heading = searchResults.length ? `Showing results for '${displayedSearchTerm}'`
                                         : `Could not find results for '${displayedSearchTerm}'`;

    return (
        <>
            <h1 className="title mb-0">{heading}</h1>
            <Results.Provider value={searchResults}>
                <SearchResults />
                {searchResults.length === 0 && <Error text="No Results"/>}
            </Results.Provider>
        </>
    )

}