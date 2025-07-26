import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import SearchResults from '../components/search/SearchResults'
import Error from '../components/Error'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SwitchPageContext } from '../contexts/SwitchPageContext';
import { SearchTriggerContext } from '../contexts/SearchTriggerContext';

const API_BASE = import.meta.env.VITE_API_URL;


export const Results = createContext();

export default function Search() {
    const navigate = useNavigate();
    const { searchAttempt } = useContext(SearchTriggerContext);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get("q");

    // I made the displayed search term a state depending on the search term instead of using the search term
    // directly so that the heading only updates when the data is returned, instead of flashing the wrong heading

    // I also track the first load of the page otherwise it would flash "Could not find results" before recieving data
    const [searchResults, setSearchResults] = useState([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [displayedSearchTerm, setDisplayedSearchTerm] = useState(searchTerm);

    // Error Handling
    const [errorStatus, setErrorStatus] = useState(-1);
    const [errorMessage, setErrorMessage] = useState("Could not retrieve data");

    // Handle css transitions before switching pages
    const { isSwitchPage, setIsSwitchPage } = useContext(SwitchPageContext);

    useEffect(handleSearch, [searchParams])
    useEffect(() => {
        if (errorStatus !== -1) handleSearch();
    }, [searchAttempt])

    function handleSearch() {
        if (!searchTerm) {
            navigate("/");
            return;
        }

        document.title = `${searchTerm} - TV List`;
        
        setIsSwitchPage(true);

        const config = { params: { q: searchTerm } }
        axios.get(`${API_BASE}/search`, config)
        .then(res => {
            setSearchResults(res.data);
            setDisplayedSearchTerm(searchTerm);
            setIsFirstLoad(false);
            setErrorStatus(-1);
            setIsSwitchPage(false);
        })
        .catch(err => {
            setErrorStatus(err.request?.status || 500);
            setErrorMessage(err.response?.data?.message || "Could not retrieve data");
        })
    }

    const heading = searchResults.length ? `Showing results for '${displayedSearchTerm}'`
                                         : `Could not find results for '${displayedSearchTerm}'`;
                                    
    if (errorStatus === -1) {
        return (
            <>
                <h1 className={"title mb-0" + (isSwitchPage ? " animate" : "")}>{!isFirstLoad && heading}</h1>
                <Results.Provider value={searchResults}>
                    <SearchResults />
                    {!isFirstLoad && searchResults.length === 0 && <Error text="No Results"/>}
                </Results.Provider>
            </>
        )
    } 
    else {
        return <Error statusCode={errorStatus} text={errorMessage} />
    }
}