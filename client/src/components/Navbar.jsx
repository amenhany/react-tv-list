import '../../public/css/Navbar.css'
import DarkModeButton from './DarkModeButton';
import Searchbar from './Searchbar';

export default function Navbar() {
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
                    <Searchbar />
                </div>
                <div className="col-2 d-flex justify-content-end me-1">
                    <DarkModeButton />
                </div>
            </div>
        </nav>
    )
}