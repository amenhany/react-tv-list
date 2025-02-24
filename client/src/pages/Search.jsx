import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import SearchResults from '../components/SearchResults'
import Error from '../components/Error'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SwitchPage } from '../App';


export const Results = createContext();

export default function Search() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get("q");

    // I made the displayed search term a state depending on the search term instead of using the search term
    // directly so that the heading only updates when the data is returned, instead of flashing the wrong heading

    // I also track the first load of the page otherwise it would flash "Could not find results" before recieving data
    const [searchResults, setSearchResults] = useState([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [errorStatus, setErrorStatus] = useState(-1);
    const [displayedSearchTerm, setDisplayedSearchTerm] = useState(searchTerm);

    const { isSwitchPage, setIsSwitchPage } = useContext(SwitchPage);

    useEffect(() => {
        if (searchTerm === null) navigate("/");
        setIsSwitchPage(true);

        const config = { params: { q: searchTerm } }
        axios.get("http://localhost:3000/search", config)
        .then(res => {
            setSearchResults(res.data);
            setDisplayedSearchTerm(searchTerm);
            setIsFirstLoad(false);
            setErrorStatus(-1);
            setIsSwitchPage(false);
        })
        .catch(err => {
            setErrorStatus(err.request.status);
            setSearchParams({});
        })
    }, [searchParams])

    const heading = searchResults.length ? `Showing results for '${displayedSearchTerm}'`
                                         : `Could not find results for '${displayedSearchTerm}'`;

    return (
        <> 
        { errorStatus === -1 ?
            <>
                <h1 className={"title mb-0" + (isSwitchPage ? " animate" : "")}>{!isFirstLoad && heading}</h1>
                <Results.Provider value={searchResults}>
                    <SearchResults />
                    {!isFirstLoad && searchResults.length === 0 && <Error text="No Results"/>}
                </Results.Provider>
            </>
            : <Error statusCode={errorStatus} text="Could not retrieve data" />
        }
        </>
    )

}