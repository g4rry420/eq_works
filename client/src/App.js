import React, { useEffect, Suspense, lazy } from 'react'
import { connect } from "react-redux"
import { Route, Switch } from "react-router-dom"


import './App.css';
import { getDailyEventsAsync, getHourlyEventsAsync, getStatsDailyAsync, getStatsHourlyAsync, getPoiAsync } from "./actions/apiActions"
import ErrorBoundary from "./components/error-boundary/error-boundary.component"
import Spinner from './components/spinner/spinner.component';

const MapBox = lazy(() => import("./components/MapBox/MapBox.component"));
const StatsHourly = lazy(() => import("./components/StatsHourly/StatsHourly.component"));
const StatsDaily = lazy(() => import("./components/StatsDaily/StatsDaily.component"));
const EventsDaily = lazy(() => import("./components/EventsDaily/EventsDaily.component"))
const EventsHourly = lazy(() => import("./components/EventsHourly/EventsHourly.component"))
const Homepage = lazy(() => import("./components/Homepage/Homepage.component"));

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
      <ErrorBoundary>
        <div className="app-heading">
          <h1>Welcome to EQ Works 😎</h1>
        </div>
        <Suspense fallback={<Spinner/>}>
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/events/daily" component={EventsDaily} />
            <Route exact path="/events/hourly" component={EventsHourly} />
            <Route exact path="/stats/daily" component={StatsDaily} />
            <Route exact path="/stats/hourly" component={StatsHourly} />
            <Route exact path="/map" component={MapBox} />
          </Switch>
        </Suspense>
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
