import axios from "axios";
import { useContext, useEffect, useState } from "react";
import '../css/Home.css';
import Searchbar from "../components/navbar/Searchbar";
import { useAuth } from "../contexts/AuthContext";
import { SwitchPageContext } from "../contexts/SwitchPageContext";
import NavMenu from "../components/navbar/NavMenu";
import ShowResult from "../components/search/ShowResult";
import Carousel from "../components/Carousel";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;


export default function Home() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { isSwitchPage } = useContext(SwitchPageContext);

    const [creatorList, setCreatorList] = useState([]);
    const [animeList, setAnimeList] = useState([]);
    const [egyptianList, setEgyptianList] = useState([]);

    useEffect(() => {
        document.title = 'TV List';
        document.body.classList.add('home-bg');

        axios.get(`${API_BASE}`, { params: { ids: [919, 1536, 2071, 48450, 5276] } })
        .then(res => {
            setAnimeList(res.data.animeList);
            setEgyptianList(res.data.egyptianList);
        })
        .catch(err => console.error("Error: ", err));

        axios.get(`${API_BASE}/user/ahmad/shows`)
        .then(res => setCreatorList(res.data.list.slice(0, 5)))
        .catch(err => console.error("Error: ", err));

        return () => document.body.classList.remove('home-bg');
    }, []);

    useEffect(() => {
        if (isSwitchPage){
            document.body.classList.remove('home-bg')
        }
    }, [isSwitchPage]);

    return (
        <div className={"home-page container-fluid" + (isSwitchPage ? " animate" : "")}>
            <div className="container-fluid d-flex justify-content-center h-100vh">
                {isAuthenticated &&
                    <div className="home-nav">
                        <NavMenu />
                    </div>
                }
                <div className="search-bar-wrapper col-10 col-md-8" data-bs-theme="dark">
                    <Searchbar decoration={true} delay={500} />
                </div>
            </div>
            <Carousel title={<><a onClick={() => navigate('/user/ahmad')}>Creator</a>'s Choices</>} list={creatorList} />
            <Carousel title="Top Anime" list={animeList} />
            <Carousel title="Egyptian Shows" list={egyptianList} />
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-left">
                        <p>&copy; 2025 TV List</p>
                    </div>
                    <div className="footer-right">
                        <a href="https://github.com/amenhany/react-tv-list">GitHub</a>
                        <a href="https://linkedin.com/in/amen-hany/">Linkedin</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}