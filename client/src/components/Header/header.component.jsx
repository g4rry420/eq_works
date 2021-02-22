import React, { useRef } from 'react'
import { NavLink, Link } from "react-router-dom"

import "./header.styles.css"

function Header() {
    const toggleNavbar = useRef();
    const navbar = (e) => {
        toggleNavbar.current.classList.toggle("sidebar-open")
    }

    return (
        <div>
        
        </div>
    )
}

export default Header