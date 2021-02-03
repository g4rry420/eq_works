import React,{ useState } from 'react'
import { connect } from 'react-redux';

import LineGraph from "../LineGraph/LineGraph.component"
import { dateAndTime } from "../../dateAndTime"
import Spinner from "../spinner/spinner.component"

function EventsDaily(props) {
    const { dailyEvents, error } = props;


    const [type, setType] = useState("bar");

    const labels = [];
    const events = [];
    if(dailyEvents && !error){
      for (let index = 0; index < dailyEvents.length; index++) {
        const element = dailyEvents[index];
        labels.push(dateAndTime(element.date, false))
        events.push(element.events)
      }
    }else if(error){
      console.log(error)
    }

    const handleChartOptionChange = (e) => {
      setType(e.target.value);
    }


    return (
        <div>
          <select name="charts" id="charts" onChange={handleChartOptionChange} value={type}>
            <option value="line">Line</option>
            <option value="bar" >Bar</option>
            <option value="horizontalBar">Horizontal Bar</option>
            <option value="radar">Radar</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
          </select>
        {
            events.length ? (
            <LineGraph 
                type={type}
                titleText={`Daily Events between 2016-2017`}
                labels={labels} 
                data={[events]} 
                labelHeading={[`Events `]} />
            ) : error ? <p style={{textAlign: "center"}}> {error} </p> : <Spinner/>
            } 
        </div>
    )
}

const mapStateToProps = state => ({
  dailyEvents:  state.api.dailyEvents,
  error: state.api.error
})

export default connect(mapStateToProps, null)(EventsDaily)