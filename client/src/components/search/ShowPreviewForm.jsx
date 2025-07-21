import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SwitchPageContext } from "../../contexts/SwitchPageContext";
import { DimmerContext } from "../../contexts/DimmerContext";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL;


export default function ShowPreviewForm({ show }) {
    const navigate = useNavigate();
    const [foundShow, setFoundShow] = useState(false);
    const [rating, setRating] = useState(0);

    const { setIsSwitchPage } = useContext(SwitchPageContext);
    const { isAuthenticated, openLoginForm, setDimmerContent } = useAuth();
    const { content } = useContext(DimmerContext);

    useEffect(() => {
        axios.get(`${API_BASE}/user/shows/${ show.id }`, { withCredentials: true })
        .then(res => {
            const rating = res.data?.rating;
            if (rating) {
                setFoundShow(true);
                setRating(rating);
            }
        })
        .catch(err => console.log(err.response?.data?.message));
    }, [])

    function handleChangeRating(evt) {
        const rating = evt.target.value;
        setRating(rating);
        if (foundShow) {
            axios.patch(`${API_BASE}/user/shows/${show.id}`, { tvmazeId: show.id, rating }, { withCredentials: true })
            .catch(err => console.error("Error:", err.response?.data?.message));
        }
    }

    function addToList() {
        if (!isAuthenticated) {
            openLoginForm();
            setDimmerContent(content);
            return;
        }

        axios.post(`${API_BASE}/user/shows`, { tvmazeId: show.id, rating }, { withCredentials: true })
        .then(res => {
            console.log(res.data?.message);
            goToList();
        })
        .catch(err => {
            if (err.status === 401) {
                console.log(err.response?.data?.message);
                openLoginForm();
                setDimmerContent(content);
            }
        });
    }

    function goToList() {
        setIsSwitchPage(true);
        setTimeout(() => {
            setIsSwitchPage(false);
            navigate("/list");
        }, 300);
    }

    return (
        <div className="show-preview-form-wrapper">
            <div className="row show-preview-form">
                <div className="col-6 col-lg-2">
                    <label htmlFor="rating">Rating: </label>
                    <select id="rating" name="show[rating]" className="form-select"
                            value={rating} onChange={handleChangeRating}>
                        <option disabled value="0">Rating...</option>
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
                </div>
                <div className="col">
                    { !foundShow &&
                        <button onClick={addToList} className="btn btn-success py-2 px-3 mt-3 list-button">
                            Add to List
                        </button>
                    }
                    { foundShow &&
                        <button onClick={goToList} className="btn btn-primary py-2 px-3 mt-3 list-button">
                            Go to List
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}