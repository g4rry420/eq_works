import React, { useEffect } from 'react'
import { connect } from "react-redux"
import { Route, Switch } from "react-router-dom"


import './App.css';
import { getDailyEventsAsync, getHourlyEventsAsync, getStatsDailyAsync, getStatsHourlyAsync, getPoiAsync } from "./actions/apiActions"
import Homepage from "./components/Homepage/Homepage.component"
import EventsDaily from "./components/EventsDaily/EventsDaily.component"
import EventsHourly from "./components/EventsHourly/EventsHourly.component"
import StatsDaily from "./components/StatsDaily/StatsDaily.component"
import StatsHourly from "./components/StatsHourly/StatsHourly.component"
import MapBox from "./components/MapBox/MapBox.component"

function App(props) {
  const { getDailyEventsAsync, getHourlyEventsAsync, getStatsDailyAsync, getStatsHourlyAsync, getPoiAsync  } = props;

  useEffect(() => {
    getDailyEventsAsync()
    getHourlyEventsAsync()
    getStatsDailyAsync()
    getStatsHourlyAsync()
    getPoiAsync()
  }, [])

  return (
    <div className="App">
      <div className="app-heading">
        <h1>Welcome to EQ Works 😎</h1>
      </div>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/events/daily" component={EventsDaily} />
        <Route exact path="/events/hourly" component={EventsHourly} />
        <Route exact path="/stats/daily" component={StatsDaily} />
        <Route exact path="/stats/hourly" component={StatsHourly} />
        <Route exact path="/map" component={MapBox} />
      </Switch>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  getDailyEventsAsync: () => dispatch(getDailyEventsAsync()),
  getHourlyEventsAsync: () => dispatch(getHourlyEventsAsync()),
  getStatsDailyAsync: () => dispatch(getStatsDailyAsync()),
  getStatsHourlyAsync: () => dispatch(getStatsHourlyAsync()),
  getPoiAsync: () => dispatch(getPoiAsync())
})

export default connect(null, mapDispatchToProps)(App)
