import axios from "axios";
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL;


export default function Listing({ listing, list, setList, sortFn, sortKey, animationDelay }) {
    const [rating, setRating] = useState(listing.rating);

    function handleChangeRating(evt) {
        const tvmazeId = Number(evt.target.closest('tr').id);
        const rating = evt.target.value;
        const index = list.findIndex(el => el.tvmazeId === listing.tvmazeId);
        list[index].rating = rating;
        setRating(rating);
        axios.patch(`${API_BASE}/user/shows/${tvmazeId}`, { tvmazeId, rating }, { withCredentials: true })
            .catch(err => console.error("Error:", err.response?.data?.message));

        if (sortKey === 'rating') sortFn('rating');
    }

    function handleDelete(evt) {
        const tvmazeId = Number(evt.target.closest('tr').id);
        setList(list.filter(listing => listing.tvmazeId !== tvmazeId));
        axios.delete(`${API_BASE}/user/shows/${tvmazeId}`, { withCredentials: true })
            .catch(err => console.error("Error:", err.response?.data?.message));
    }

    return (
        <tr id={ listing.show.id } className="stagger-row" style={{ animationDelay }}>
            <td className="m-5 list-show-poster-container"><img src={ listing.show.image.medium } alt={listing.show.name + "Poster"} className="list-show-poster" /></td>
            <td className="show-name">
                <h2>{ listing.show.name + " (" + listing.show.premiered.split('-')[0] + ")" }</h2>
                <h3 className="text-muted">{ listing.show.genres.join(', ') }</h3>
            </td>
            <td className="text-center align-middle">{ listing.createdAt.split('T')[0].split('-').reverse().join('/') }</td>
            <td className="text-center align-middle rating-column">
                <select id="rating" name="rating" className="form-select d-inline"
                        value={rating} onChange={handleChangeRating}>
                    <option value="0">–</option>
                    <option value="10">10</option>
                    <option value="9">9</option>
                    <option value="8">8</option>
                    <option value="7">7</option>
                    <option value="6">6</option>
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                </select>
            </td>
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
    )
}