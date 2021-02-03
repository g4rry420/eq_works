import React from 'react';
import { connect } from 'react-redux';

import LineGraph from "../LineGraph/LineGraph.component"
import { dateAndTime } from "../../dateAndTime"
import Spinner from "../spinner/spinner.component"

function EventsHourly(props) {
  const { hourlyEvents, error } = props;

  const eventsHourlyEvents = []
  const eventsHourlyLabels = []
  const eventsHourlyHour = []

  if(hourlyEvents && !error) {
    for (let index = 0; index < hourlyEvents.length; index++) {
      const element = hourlyEvents[index];
      eventsHourlyEvents.push(element.events);
      eventsHourlyLabels.push(dateAndTime(element.date, true))
      eventsHourlyHour.push(element.hour);
    }
  }else if(error){
    console.log(error)
  }

  return (
      <div>
      <select name="charts" id="charts">
        <option value="line">Line</option>
      </select>
      {
        eventsHourlyLabels.length ? (
          <LineGraph 
            type={"line"}
            titleText={`Hourly Events between 2016-2017`}
            labels={eventsHourlyLabels}
            labelHeading={[`Events `, `Hours  `]}
            data={[eventsHourlyEvents, eventsHourlyHour]} />
        ) : error ? <p style={{textAlign: "center"}}> {error} </p> : <Spinner/>
      }
      </div>
  )
}

const mapStateToProps = state => ({ 
  hourlyEvents:  state.api.hourlyEvents,
  error: state.api.error
})

export default connect(mapStateToProps, null)(EventsHourly)