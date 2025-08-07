import axios from "../js/axios.js";
import { useContext, useEffect, useState } from "react";
import '../css/Home.css';
import Searchbar from "../components/navbar/Searchbar";
import { SwitchPageContext } from "../contexts/SwitchPageContext";
import NavMenu from "../components/navbar/NavMenu";
import Carousel from "../components/Carousel";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";


export default function Home() {
    const { isSwitchPage } = useContext(SwitchPageContext);

    const [isLoaded, setIsLoaded] = useState(false);
    const [scrollIndicator, setScrollIndicator] = useState(true);
    const [creatorList, setCreatorList] = useState([]);
    const [animeList, setAnimeList] = useState([]);
    const [egyptianList, setEgyptianList] = useState([]);


    useEffect(() => {
        setIsLoaded(false);
        document.title = 'TV List';
        document.body.classList.add('home-bg');

        axios.get(`/`, { params: { ids: [919, 1536, 2071, 48450, 5276] } })
        .then(res => {
            setAnimeList(res.data.animeList);
            setEgyptianList(res.data.egyptianList);
        })
        .catch(err => console.error("Error: ", err));

        axios.get(`/user/amen/shows`)
        .then(res => {
            setCreatorList(res.data.list.slice(0, 5));
            setIsLoaded(true);
        })
        .catch(err => console.error("Error: ", err));

        
        const handleScroll = () => {
            setScrollIndicator(false);
            window.removeEventListener('scroll', handleScroll);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            document.body.classList.remove('home-bg');
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (isSwitchPage){
            document.body.classList.remove('home-bg')
        }
    }, [isSwitchPage]);

    return (
        <div className={"home-page container-fluid" + (isSwitchPage ? " animate" : "")}>
            <div className="container-fluid d-flex justify-content-center h-100vh">
                <div className="home-nav" data-bs-theme="dark">
                    <NavMenu />
                </div>
                <div className="search-bar-wrapper col-10 col-md-8" data-bs-theme="dark">
                    <Searchbar decoration={true} delay={500} />
                </div>
                <div className={"scroll-indicator" + (scrollIndicator ? "" : " animate")}>
                    <div className="arrow-scroll">
                        <div className="arrow"></div>
                        <div className="arrow"></div>
                        <div className="arrow"></div>
                    </div>
                </div>
            </div>
            {isLoaded && 
            <>
                <Carousel title={<><Link to='/user/amen'>Creator</Link>'s Choices</>} list={creatorList} index={0} />
                <Carousel title="Top Anime" list={animeList} index={1} />
                <Carousel title="Egyptian Shows" list={egyptianList} index={2} />
            </>
            }
            <Footer force={true} />
        </div>
    )
}