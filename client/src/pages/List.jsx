import axios from 'axios'
import '../css/List.css'
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from "react";
import Error from '../components/Error';
import Listing from '../components/Listing';

import { DndContext, DragOverlay, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KeyboardSensor, MouseSensor } from '../components/DndHelper';

const API_BASE = import.meta.env.VITE_API_URL;


export default function List() {
    const { isAuthenticated, user, requireLogin } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);
    const [listTitle, setListTitle] = useState(user?.listTitle || "");
    const [customOrder, setCustomOrder] = useState([]);
    const [list, setList] = useState([]);
    const [activeId, setActiveId] = useState(null);
    
    const [isAscending, setIsAscending] = useState(user?.sorting?.ascending);
    const [sortKey, setSortKey] = useState(user?.sorting?.key);

    const sensors = useSensors(
                        useSensor(MouseSensor),
                        useSensor(KeyboardSensor)
                    )

    Array.prototype.move = function(a, b) {
        this.splice(b, 0, this.splice(a, 1)[0]);
        return this;
    }

    useEffect(requireLogin, [isAuthenticated]);
    useEffect(() => {
        const debounce = setTimeout(saveTitle, 4000);
        return () => clearTimeout(debounce);
    }, [listTitle])
    useEffect(() => {
        axios.get(`${API_BASE}/user/shows`, { withCredentials: true })
        .then(res => {
            setCustomOrder(res.data?.list);
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
        let ascending;
        if (sortKey === key) {
            if (!isAscending) {
                setSortKey('custom');
                setList(customOrder);
                return;
            } 
            else {
                ascending = false
            }
        } 
        else {
            ascending = true;
        }
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

    function saveOrder(list) {
        axios.patch(`${API_BASE}/user/shows`, {
            order: list.map(listing => listing.tvmazeId)
        }, { withCredentials: true })
            .catch(err => console.error("Error:", err.response?.data?.message));
    }


    if (list.length && isLoaded) {
        return (
            <section className="list-container container mb-4">
                <input className="title text-start text-body mb-4 ps-2 mt-2" 
                    placeholder="My Awesome List" 
                    value={listTitle} 
                    onChange={handleTitleChange}
                    onBlur={handleUnfocus} />

                <DndContext 
                    sensors={sensors}
                    onDragStart={handleDragStart} 
                    onDragEnd={handleDragEnd}
                    onDragCancel={() => setActiveId(null)}
                >
                    <SortableContext
                        items={list.map(item => item.tvmazeId)}
                        strategy={verticalListSortingStrategy}
                    >
                    <table className="table table-hover list selectDisable">
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
                                    key={listing.tvmazeId} 
                                    sortKey={sortKey} 
                                    sortFn={resort}
                                    animationDelay={ i*100 +"ms" }
                                    draggingId={activeId} />
                            )) }
                        </tbody>
                    </table>
                    <DragOverlay>
                        {activeId &&
                            <table className="table selectDisable dragged-listing">
                                <tbody>
                                    <Listing 
                                        listing={list.find(item => item.tvmazeId === activeId)} 
                                        list={list} 
                                        setList={setList} 
                                        sortKey={sortKey} 
                                        sortFn={resort}
                                        animationDelay={ 0 +"ms" } />
                                </tbody>
                            </table>
                        }
                    </DragOverlay>
                    </SortableContext>
                </DndContext>
            </section>
        )
    } else if (isLoaded) {
        return <Error text="Your list is empty" />
    } else {
        return <></>
    }

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        const originalPos = list.findIndex(listing => listing.tvmazeId === active.id);
        const newPos = list.findIndex(listing => listing.tvmazeId === over.id);

        const swappedList = [...list];
        setList(swappedList.move(originalPos, newPos));
        setSortKey('custom');
        saveOrder(swappedList);
        setCustomOrder(swappedList);
    }
}