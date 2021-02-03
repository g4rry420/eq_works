import React from 'react';
import { connect } from 'react-redux';

import LineGraph from "../LineGraph/LineGraph.component"
import { dateAndTime } from "../../dateAndTime"
import Spinner from "../spinner/spinner.component"

function StatsHourly(props) {
    const { statsHourly, error }= props;

    const statsHourlyLabels = [];
    const statsHourlyImpressions = [];
    const statsHourlyClicks = [];
    const statsHourlyRevenue = [];
    const statsHourlyHour = []; 

    if(statsHourly && !error){
        for (let index = 0; index < statsHourly.length; index++) {
            const element = statsHourly[index];
            statsHourlyLabels.push(dateAndTime(element.date, true));
            statsHourlyImpressions.push(element.impressions)
            statsHourlyClicks.push(element.clicks)
            statsHourlyRevenue.push(element.revenue);
            statsHourlyHour.push(element.hour)
        }
    }else if(error){
        console.log(error)
    }

    return (
        <div>
        <select name="charts" id="charts">
          <option value="line" selected>Line</option>
        </select>
        {
            statsHourlyLabels.length ? (
                <LineGraph
                    type={"line"}
                    titleText={`Hourly Stats between 2016-2017`} 
                    labels={statsHourlyLabels}
                    labelHeading={[`Clicks`, `Impressions`, `Revenue`, `Hours`]}
                    data={[statsHourlyClicks, statsHourlyImpressions, statsHourlyRevenue, statsHourlyHour]} />
            ) : error ? <p style={{textAlign: "center"}}> {error} </p> : <Spinner/>
        }
        </div>
    )
}

const mapStateToProps = state => ({
    statsHourly:  state.api.statsHourly,
    error: state.api.error
})

export default connect(mapStateToProps, null)(StatsHourly)