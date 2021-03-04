import React from 'react'

import EventsDaily from "../EventsDaily/EventsDaily.component"
import EventsHourly from "../EventsHourly/EventsHourly.component"

export default function Events() {
    return (
        <div className="container"
        >
            <EventsDaily/>
            <EventsHourly/>
        </div>
    )
}
