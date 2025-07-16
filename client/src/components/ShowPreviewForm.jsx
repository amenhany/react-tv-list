import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SwitchPageContext } from "../contexts/SwitchPageContext";
import { DimmerContext } from "../contexts/DimmerContext";
import { useAuth } from "../contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL;


export default function ShowPreviewForm({ show }) {
    const navigate = useNavigate();
    const [rating, setRating] = useState("");

    const { setIsSwitchPage } = useContext(SwitchPageContext);
    const { user, openLoginForm, setDimmerContent } = useAuth();
    const { content } = useContext(DimmerContext);

    function addToList() {
        if (!user) {
            openLoginForm();
            setDimmerContent(content);
            return;
        }

        axios.post(`${API_BASE}/user/${user.id}/list`, { tvmazeId: show.id, rating }, { withCredentials: true })
        .then(res => {
            console.log(res.data?.message);
            setIsSwitchPage(true);
            setTimeout(() => {
                setIsSwitchPage(false);
                navigate("/list");
            }, 300);
        })
        .catch(err => {
            if (err.status === 401) {
                console.log(err.response?.data?.message);
                openLoginForm();
                setDimmerContent(content);
            }
        });
    }

    return (
        <div className="show-preview-form-wrapper">
            <div className="row show-preview-form">
                <div className="col-6 col-lg-2">
                    <label htmlFor="rating">Rating: </label>
                    <select id="rating" name="show[rating]" className="form-select"
                            value={rating} onChange={e => setRating(e.target.value)}>
                        <option disabled value="">Rating...</option>
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
                    <button onClick={addToList} className="btn btn-success py-2 px-3 mt-3 list-button">
                        Add to List
                    </button>
                </div>
            </div>
        </div>
    )
}