import { createContext, useEffect, useState } from 'react';
import SearchResults from '../components/SearchResults'


export const Results = createContext();

export default function Search() {
    const [searchResults, setSearchResults] = useState([]);

    const fetchAPI = async () => {
        const response = await fetch("http://localhost:3000/list");
        const data = await response.json();
        setSearchResults(data);
    }

    useEffect(() => {
        fetchAPI();
    }, [])

    return (
        <>
            <Results.Provider value={searchResults}>
                <SearchResults />
            </Results.Provider>
        </>
    )

}