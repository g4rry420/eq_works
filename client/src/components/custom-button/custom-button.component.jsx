import React, { forwardRef } from 'react'

import "./custom-button.styles.css"

const CustomButton = forwardRef(({ title, button, type }, ref) => {
    return (
        <button ref={ref} type={type} className={`btn custom-button ${button}`}>
            <div className="p-2"> {title} </div>
        </button>
    )
})

export default CustomButton