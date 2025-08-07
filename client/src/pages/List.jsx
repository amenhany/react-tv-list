import axios from "../js/axios.js";
import '../css/List.css'
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect, useContext } from "react";
import Error from '../components/Error';
import Listing from '../components/Listing';

import { DndContext, DragOverlay, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KeyboardSensor, MouseSensor, TouchSensor } from '../components/DndHelper';
import { SwitchPageContext } from '../contexts/SwitchPageContext';
import { useLocation } from 'react-router-dom';


export default function List({ user = null }) {
    const { isAuthenticated, user: currentUser, requireLogin, checkSession } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOwner, setIsOwner] = useState(!user || user?.username === currentUser?.username);
    const [listTitle, setListTitle] = useState(isOwner ? currentUser?.listTitle || "" : user?.listTitle || `${user?.username}'s List`);
    const [customOrder, setCustomOrder] = useState([]);
    const [list, setList] = useState([]);
    const [activeId, setActiveId] = useState(null);

    const location = useLocation();
    const { isSwitchPage } = useContext(SwitchPageContext);
    
    const [isAscending, setIsAscending] = useState(isOwner ? currentUser?.sorting?.ascending : user?.sorting?.ascending);
    const [sortKey, setSortKey] = useState(isOwner ? currentUser?.sorting?.key : user?.sorting?.key);

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(KeyboardSensor),
        useSensor(TouchSensor)
    );

    Array.prototype.move = function(a, b) {
        this.splice(b, 0, this.splice(a, 1)[0]);
        return this;
    }

    useEffect(() => {
        setIsOwner(false);
        if (!user) {
            requireLogin();
            setIsOwner(true);
        }
        if (user?.username === currentUser?.username) {
            setIsOwner(true);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isOwner) return;
        const debounce = setTimeout(saveTitle, 4000);
        return () => clearTimeout(debounce);
    }, [listTitle]);

    useEffect(() => {
        setIsLoaded(false);
        setList([]);
        if (isOwner) {
            document.title = `${listTitle || "My List"} - TV List`;

            axios.get(`/user/shows`, { withCredentials: true })
            .then(res => {
                setCustomOrder(res.data?.list);
                setSortKey(currentUser.sorting.key);
                setIsAscending(currentUser.sorting.ascending);
                setList(getSortedList(res.data?.list, currentUser.sorting.key, currentUser.sorting.ascending));
                setIsLoaded(true);
            })
            .catch(err => console.log(err.response?.data?.message));
        } else if (user) {
            axios.get(`/user/${user.username}/shows`)
            .then(res => {
                setCustomOrder(res.data?.list);
                setSortKey(user.sorting.key);
                setIsAscending(user.sorting.ascending);
                setList(getSortedList(res.data?.list, user.sorting.key, user.sorting.ascending));
                setIsLoaded(true);
            })
            .catch(err => console.log(err.response?.data?.message));
        } else {
            setIsLoaded(true);
        }
    }, [user, location.pathname]);

    useEffect(() => {
        if (!isOwner) return;
        const debounce = setTimeout(() => 
            axios.patch(`/user/shows`, {
                sorting: { key: sortKey, ascending: isAscending }
            }, { withCredentials: true })
                .catch(err => console.error("Error:", err.response?.data?.message))
        , 500);
        return () => clearTimeout(debounce);
    }, [isAscending, sortKey]);

    useEffect(() => {
        if (!isOwner) return;
        saveTitle();
        axios.patch(`/user/shows`, {
            sorting: { key: sortKey, ascending: isAscending }
        }, { withCredentials: true })
            .catch(err => console.error("Error:", err.response?.data?.message))

        checkSession();
    }, [isSwitchPage]);


    function saveTitle() {
        if (!isOwner) return;
        const title = listTitle.trim();
        document.title = `${title || "My List"} - TV List`;
        axios.patch(`/user/shows`, { title }, { withCredentials: true })
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
        if (!isOwner) return;
        let ascending;
        if (sortKey === key) {
            if (!isAscending) {
                setSortKey('custom');
                setList(customOrder);
                setIsAscending(true);
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
        if (!isOwner) return;
        axios.patch(`/user/shows`, {
            order: list.map(listing => listing.tvmazeId)
        }, { withCredentials: true })
            .catch(err => console.error("Error:", err.response?.data?.message));
    }


    if (list.length && isLoaded) {
        return (
            <section className="list-container container mb-4">
                { isOwner ? 
                    <input className={"title text-start text-body mb-4 ps-2 mt-2" + (isSwitchPage ? " animate" : "")} 
                    placeholder="My Awesome List" 
                    value={listTitle} 
                    onChange={handleTitleChange}
                    onBlur={handleUnfocus} />
                    :
                    <h1 className={"title text-start text-body mb-4 ps-2 mt-2" + (isSwitchPage ? " animate" : "")}>
                        {listTitle}
                    </h1>
                }

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
                    <table className={"table table-hover list selectDisable" + (isSwitchPage ? " animate" : "")}>
                        <thead>
                            <tr>
                                <th scope="col" className="text-center">Poster</th>
                                <th scope="col" onClick={() => sortList('name')} className={"sorting-header" + (!isOwner ? " not-clickable" : " clickable")}>Details 
                                    <span className={"sort-icon" + (sortKey === 'name' ? " active" : "")}>
                                        {isAscending ? ' ▲' : ' ▼'}
                                    </span>
                                </th>
                                <th scope="col" onClick={() => sortList('dateAdded')} className={"text-center d-none d-md-table-cell sorting-header ps-4" + (!isOwner ? " not-clickable" : " clickable")}>Added on 
                                    <span className={"sort-icon" + (sortKey === 'dateAdded' ? " active" : "")}>
                                        {isAscending ? ' ▲' : ' ▼'}
                                    </span>
                                </th>
                                <th scope="col" onClick={() => sortList('rating')} className={"text-center sorting-header pe-0" + (!isOwner ? " not-clickable" : " clickable")}>Rating 
                                    <span className={"sort-icon" + (sortKey === 'rating' ? " active" : "")}>
                                        {isAscending ? ' ▲' : ' ▼'}
                                    </span>
                                </th>
                                {isOwner && <th></th>}
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
                                    animationDelay={ i*100 }
                                    draggingId={activeId}
                                    isOwner={isOwner} />
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
                                        animationDelay={ 0 }
                                        isOwner={isOwner} />
                                </tbody>
                            </table>
                        }
                    </DragOverlay>
                    </SortableContext>
                </DndContext>
            </section>
        )
    } else if (isLoaded) {
        return <Error text={(isOwner ? "Your" : `${user?.username}'s`) + " list is empty"} />
    } else {
        return <></>
    }

    function handleDragStart(event) {
        if ('vibrate' in navigator) {
            navigator.vibrate(20);
        }
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