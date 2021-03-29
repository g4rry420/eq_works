import React,{ Fragment } from 'react'
import { motion } from "framer-motion"

import "./spinner.styles.css"

export default function Spinner() {
    return (
        <Fragment>
            <motion.div className="spinner-overlay"
            >
                <div className="spinner-container">
                </div>
            </motion.div>
            <p>The backend is hosted in Glitch.So, it might take a minute to load. Please, wait. Thank You</p>
        </Fragment>
    )
}
