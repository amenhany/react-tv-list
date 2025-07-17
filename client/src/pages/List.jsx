import axios from 'axios'
import '../css/List.css'
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from "react";
import Error from '../components/Error';

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
        .catch(err => {
            if (err.status === 401) {
                console.log(err.response?.data?.message);
                openLoginForm();
                setDimmerContent(content);
            }
        });
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

    function handleDelete(evt) {
        const tvmazeId = Number(evt.target.closest('tr').id);
        setList(list.filter(listing => listing.tvmazeId !== tvmazeId));
        axios.delete(`${API_BASE}/user/shows/${tvmazeId}`, { withCredentials: true })
            .catch(err => console.error("Error:", err.response?.data?.message));
    }

    function sortList(key) {
        const ascending = sortKey === key ? !isAscending : true;
        const sorted = getSortedList(list, key, ascending);
        setList(sorted);
        setSortKey(key);
        setIsAscending(ascending);
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
            <section className="list container">
                <input className="title text-start mb-4 ps-2 mt-2" 
                    placeholder="My Awesome List" 
                    value={listTitle} 
                    onChange={handleTitleChange}
                    onBlur={handleUnfocus} />
                <table className="table table-hover selectDisable">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center">Poster</th>
                            <th scope="col" onClick={() => sortList('name')}>Details 
                                <span style={{ visibility: sortKey === 'name' ? 'visible' : 'hidden' }}>
                                    {isAscending ? ' ▲' : ' ▼'}
                                </span>
                            </th>
                            <th scope="col" onClick={() => sortList('dateAdded')} className="text-center">Added on 
                                <span style={{ visibility: sortKey === 'dateAdded' ? 'visible' : 'hidden' }}>
                                    {isAscending ? ' ▲' : ' ▼'}
                                </span>
                            </th>
                            <th scope="col" onClick={() => sortList('rating')} className="text-center">Rating 
                                <span style={{ visibility: sortKey === 'rating' ? 'visible' : 'hidden' }}>
                                    {isAscending ? ' ▲' : ' ▼'}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                    { list.map(listing => (
                        <tr key={ listing.show.id } id={ listing.show.id }>
                            <td className="m-5 list-show-poster-container"><img src={ listing.show.image.medium } alt={listing.show.name + "Poster"} className="list-show-poster" /></td>
                            <td className="show-name">
                                <h2>{ listing.show.name + " (" + listing.show.premiered.split('-')[0] + ")" }</h2>
                                <h3 className="text-muted">{ listing.show.genres.join(', ') }</h3>
                            </td>
                            <td className="text-center align-middle">{ listing.createdAt.split('T')[0].split('-').reverse().join('/') }</td>
                            <td className="text-center align-middle">{ listing.rating }/10</td>
                            <td className="popup-button-container p-0">
                            <div className="d-flex justify-content-end text-body">
                                <button className="border-0 bg-transparent popup-button p-0 pt-1 text-body" onClick={handleDelete}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-x popup-button-svg" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                </button>
                            </div>
                            </td>
                        </tr>
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