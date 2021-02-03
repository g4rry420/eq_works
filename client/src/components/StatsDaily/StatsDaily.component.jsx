import React,{ useState } from 'react';
import { connect } from 'react-redux';

import LineGraph from "../LineGraph/LineGraph.component"
import { dateAndTime } from "../../dateAndTime"
import Spinner from "../spinner/spinner.component"

function StatsDaily(props) {
    const { statsDaily, error } = props
    const [type, setType] = useState("bar");

    const statsDailyLabels = [];
    const statsDailyImpressions = [];
    const statsDailyClicks = [];
    const statsDailyRevenue = [];

    if(statsDaily && !error){
        for (let index = 0; index < statsDaily.length; index++) {
            const element = statsDaily[index];
            statsDailyLabels.push(dateAndTime(element.date, false));
            statsDailyImpressions.push(element.impressions);
            statsDailyClicks.push(element.clicks);
            statsDailyRevenue.push(element.revenue);
        }
    }else if(error){
        console.log(error)
    }

    const handleChartOptionChange = (e) => {
        setType(e.target.value)
    }

    return (
        <div>
            <select name="charts" id="charts" onChange={handleChartOptionChange} value={type}>
                <option value="line">Line</option>
                <option value="bar">Bar</option>
                <option value="horizontalBar">Horizontal Bar</option>
                <option value="radar">Radar</option>
            </select>
        {
            statsDailyLabels.length ? (
                <LineGraph 
                    type={type}
                    titleText={`Daily Stats between 2016-2017`}
                    labels={statsDailyLabels}
                    labelHeading={[`Clicks`, `Impressions`, `Revenue`]}
                    data={[statsDailyClicks, statsDailyImpressions, statsDailyRevenue]} />
            ) : error ? <p style={{textAlign: "center"}}> {error} </p> : <Spinner/>
        }
        </div>
    )
}

const mapStateToProps = state => ({ 
    statsDaily:  state.api.statsDaily,
    error: state.api.error
})

export default connect(mapStateToProps, null)(StatsDaily)