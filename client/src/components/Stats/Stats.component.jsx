import React from 'react'

import StatsHourly from "../StatsHourly/StatsHourly.component"
import StatsDaily from "../StatsDaily/StatsDaily.component"

export default function Stats() {
    return (
        <div className="container"
        >
            <StatsDaily/>
            <StatsHourly/>
        </div>
    )
}
