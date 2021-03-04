import React, { useEffect } from 'react'
import { connect } from "react-redux"
import { Route, Switch, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import './App.css';
import { getDailyEventsAsync, getHourlyEventsAsync, getStatsDailyAsync, getStatsHourlyAsync, getPoiAsync } from "./actions/apiActions"
import ErrorBoundary from "./components/error-boundary/error-boundary.component"
import Header from "./components/Header/header.component"
import MapBox from "./components/MapBox/MapBox.component"
import Stats from "./components/Stats/Stats.component"
import Events from "./components/Events/Events.component"
import Homepage from "./components/Homepage/Homepage.component"


function App(props) {
  const { getDailyEventsAsync, getHourlyEventsAsync, getStatsDailyAsync, getStatsHourlyAsync, getPoiAsync  } = props;
  const location = useLocation();
  useEffect(() => {
    getDailyEventsAsync()
    getHourlyEventsAsync()
    getStatsDailyAsync()
    getStatsHourlyAsync()
    getPoiAsync()
  }, [])

  return (
    <div className="App">
      <ErrorBoundary>
        <Header/>
        <AnimatePresence exitBeforeEnter>
            <Switch location={location} key={location.key} >
              <Route exact path="/" component={Homepage} />
              <Route exact path="/events" component={Events} />
              <Route exact path="/stats" component={Stats} />
              <Route exact path="/map" component={MapBox} />
            </Switch>
        </AnimatePresence>
      </ErrorBoundary>
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
