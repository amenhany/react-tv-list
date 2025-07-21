import axios from 'axios'
import '../css/List.css'
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from "react";
import Error from '../components/Error';
import Listing from '../components/Listing';

const API_BASE = import.meta.env.VITE_API_URL;


export default function List() {
    const { isAuthenticated, user, requireLogin } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);
    const [listTitle, setListTitle] = useState(user?.listTitle || "");
    const [list, setList] = useState([]);
    
    const [isAscending, setIsAscending] = useState(user?.sorting?.ascending);
    const [sortKey, setSortKey] = useState(user?.sorting?.key);

    useEffect(requireLogin, [isAuthenticated]);
    useEffect(() => {
        const debounce = setTimeout(saveTitle, 4000);
        return () => clearTimeout(debounce);
    }, [listTitle])
    useEffect(() => {
        axios.get(`${API_BASE}/user/shows`, { withCredentials: true })
        .then(res => {
            setList(getSortedList(res.data?.list, sortKey, isAscending));
            setIsLoaded(true);
        })
        .catch(err => console.log(err.response?.data?.message));
    }, []);
    useEffect(() => {
        const debounce = setTimeout(() => 
            axios.patch(`${API_BASE}/user/shows`, {
                sorting: { key: sortKey, ascending: isAscending }
            }, { withCredentials: true })
                .catch(err => console.error("Error:", err.response?.data?.message))
        , 500);
        return () => clearTimeout(debounce);
    }, [isAscending, sortKey]);


    function saveTitle() {
        const title = listTitle.trim();
        axios.patch(`${API_BASE}/user/shows`, { title }, { withCredentials: true })
            .catch(err => console.error("Error:", err.response?.data?.message));
    }

    function handleTitleChange(evt) {
        setListTitle(evt.target.value.trimStart());
    }

    function handleUnfocus() {
        setListTitle(listTitle.trim());
        saveTitle(listTitle);
    }

    function sortList(key) {
        const ascending = sortKey === key ? !isAscending : true;
        const sorted = getSortedList(list, key, ascending);
        setList(sorted);
        setSortKey(key);
        setIsAscending(ascending);
    }

    function resort() {
        setList(getSortedList(list, sortKey, isAscending));
    }

    function getSortedList(list, key, ascending) {
        const sorted = [...list];
        
        switch (key) {
            case 'name':
                sorted.sort((a, b) => a.show.name.localeCompare(b.show.name));
                break;
            case 'rating':
                sorted.sort((a, b) => {
                    const diff = a.rating - b.rating;
                    return diff !== 0 ? diff : b.show.name.localeCompare(a.show.name);
                });
                break;
            case 'dateAdded':
                sorted.sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    const diff = dateA - dateB;
                    return diff !== 0 ? diff : b.show.name.localeCompare(a.show.name);
                });
                break;
            default:
                return list;
        }

        return ascending ? sorted : sorted.reverse();
    }

    function saveOrder() {
        axios.patch(`${API_BASE}/user/shows`, {
            order: list.map(tvmazeId => tvmazeId)
        }, { withCredentials: true })
            .catch(err => console.error("Error:", err.response?.data?.message));
    }

    if (list.length && isLoaded) {
        return (
            <section className="list container mb-4">
                <input className="title text-start text-body mb-4 ps-2 mt-2" 
                    placeholder="My Awesome List" 
                    value={listTitle} 
                    onChange={handleTitleChange}
                    onBlur={handleUnfocus} />
                <table className="table table-hover selectDisable">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center">Poster</th>
                            <th scope="col" onClick={() => sortList('name')} className="sorting-header">Details 
                                <span style={{ visibility: sortKey === 'name' ? 'visible' : 'hidden' }}>
                                    {isAscending ? ' ▲' : ' ▼'}
                                </span>
                            </th>
                            <th scope="col" onClick={() => sortList('dateAdded')} className="text-center sorting-header">Added on 
                                <span style={{ visibility: sortKey === 'dateAdded' ? 'visible' : 'hidden' }}>
                                    {isAscending ? ' ▲' : ' ▼'}
                                </span>
                            </th>
                            <th scope="col" onClick={() => sortList('rating')} className="text-center sorting-header pe-0">Rating 
                                <span style={{ visibility: sortKey === 'rating' ? 'visible' : 'hidden' }}>
                                    {isAscending ? ' ▲' : ' ▼'}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                    { list.map((listing, i) => (
                        <Listing 
                            listing={listing} 
                            list={list} 
                            setList={setList} 
                            key={listing.show.id} 
                            sortKey={sortKey} 
                            sortFn={resort}
                            animationDelay={ i*100 +"ms" } />
                    )) }
                    </tbody>
                </table>
            </section>
        )
    } else if (isLoaded) {
        return <Error text="Your list is empty" />
    } else {
        return <></>
    }
}