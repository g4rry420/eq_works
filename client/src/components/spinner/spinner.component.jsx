import React from 'react'
import { motion } from "framer-motion"

import "./spinner.styles.css"

export default function Spinner() {
    return (
        <motion.div className="spinner-overlay"
        >
            <div className="spinner-container">
            </div>
        </motion.div>
    )
}
