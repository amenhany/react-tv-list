import { useState } from 'react';
import '../../public/css/Navbar.css'

export default function Navbar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    return (
        <nav className="navbar navbar-expand-md purple-nav navbar-dark fixed-top">
            <div className="container-fluid">
                <div className="col-4">
                    <a className="navbar-brand home-button ms-1" href="/">
                        <img src="../../public/imgs/tv.png" alt="TV icon" width="30" height="30" className="pt-0 me-1 d-inline-block align-text-top" />
                        <span> TV Series</span>
                    </a>
                </div>
                <div className="col-xl-4 col-sm-6 col-4 position-absolute top-50 start-50 translate-middle">
                    <form className="d-flex" id="searchForm" action="/search">
                        <input className="form-control me-1" type="search" placeholder="Search" aria-label="Search" name="q" required />
                        <button className="border-0 bg-transparent search-button nav-button">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        </button>
                    </form>
                </div>
                <div className="col-2 d-flex justify-content-end me-1">
                    <div id="btn_darkmode">
                        <svg className="icon-link nav-button bi bi-moon" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
                            <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/>
                        </svg>
                    </div>
                </div>
            </div>
        </nav>
    )
}