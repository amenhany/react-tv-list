import axios from 'axios';
import { useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';


export default function Searchbar() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");

    function handleChange(evt) {
        setSearchText(evt.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (searchText.trim() !== "") {
            navigate({
                pathname: "/search",
                search: createSearchParams({
                    q: searchText.trim()
                }).toString()
            });
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className="d-flex" id="searchForm" action="/search">
            <input value={searchText} onChange={handleChange} className="form-control me-1" type="search" placeholder="Search" aria-label="Search" name="q" />
            <button className="border-0 bg-transparent search-button nav-button">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>
        </form>
    )
}