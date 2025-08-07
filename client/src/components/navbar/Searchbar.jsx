import { useState, useContext } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { SearchTriggerContext } from '../../contexts/SearchTriggerContext';
import { SwitchPageContext } from '../../contexts/SwitchPageContext';


export default function Searchbar({ decoration = false, delay = 0 }) {
    const navigate = useNavigate();
    const { setIsSwitchPage } = useContext(SwitchPageContext);
    const { triggerSearch } = useContext(SearchTriggerContext);
    const [searchText, setSearchText] = useState("");

    function handleChange(evt) {
        setSearchText(evt.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (searchText.trim() !== "") {
            setIsSwitchPage(true);
            setTimeout(() => {
                navigate({
                    pathname: "/search",
                    search: createSearchParams({
                        q: searchText.trim()
                    }).toString()
                });
                setIsSwitchPage(false);
            }, delay);
        }

        triggerSearch();
    }
    
    return (
        <form onSubmit={handleSubmit} className="d-flex position-relative" id="searchForm" action="/search">
            {decoration &&
                <svg className="search-decoration" viewBox="0 0 24 24" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            }
            <input value={searchText} onChange={handleChange} className={"form-control " + (decoration ? "search-input" : "me-1")} type="search" placeholder={decoration ? "Try searching a show..." : "Search"} aria-label="Search" name="q" />
            { !decoration &&
            <button className="border-0 bg-transparent search-button nav-button">
                <svg viewBox="0 0 24 24" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>
            }
        </form>
    )
}