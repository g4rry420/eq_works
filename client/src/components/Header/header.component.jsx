import React, { useRef } from 'react'
import { Link } from "react-router-dom"

import "./header.styles.css"

function Header() {
    const toggleNavbar = useRef();
    const navbar = (e) => {
        toggleNavbar.current.classList.toggle("sidebar-open")
    }
    return (
        <div className="container-fluid header-container">
        <nav className="container d-flex p-3 justify-content-between">
            <div className="burger-navbar" onClick={navbar}>
                <div className="navs">
                    <div className="burger">
                        <input type="checkbox" className="menu-open" name="menu-open" id="menu-open" />
                        <label className="patty" htmlFor="menu-open">
                            <span className="hamburger"></span>
                        </label>
                    </div>
                    <div className="nav-menu" ref={toggleNavbar}>
                        <ul className="nav-list">
                            <li className="list-menu"><Link  to="/" className="icon-link icon-2">Home</Link></li>
                            <li className="list-menu "><Link  to="/map"  className="icon-link icon-2">Map</Link></li>
                            <li className="list-menu"><Link  to="/events"  className="icon-link icon-2">Events</Link></li> 
                            <li className="list-menu"><Link  to="/stats"  className="icon-link icon-2">Statistics</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <ul className="nav-list-desktop d-flex links justify-around">
                <li className="list-menu-desktop"><Link  to="/" className="icon-link icon-2">Home</Link></li>
                <li className="list-menu-desktop"><Link  to="/map"  className="icon-link icon-2">Map</Link></li>
                <li className="list-menu-desktop"><Link  to="/events"  className="icon-link icon-2">Events</Link></li> 
                <li className="list-menu-desktop"><Link  to="/stats"  className="icon-link icon-2">Statistics</Link></li> 
            </ul>
        </nav>
        </div>
    )
}

export default Header