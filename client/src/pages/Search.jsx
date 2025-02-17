import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import SearchResults from '../components/SearchResults'


export const Results = createContext();

export default function Search() {
    const [searchResults, setSearchResults] = useState([]);
    const searchTerm = "breaking bad";

    useEffect(() => {
        axios.get("http://localhost:3000/search")
        .then(res => {
            setSearchResults(res.data);
        })
    }, [])

    return (
        <>
            <h1 className="title mb-0">Showing results for '{searchTerm}'</h1>
            <Results.Provider value={searchResults}>
                <SearchResults />
            </Results.Provider>
        </>
    )

}