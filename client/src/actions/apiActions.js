import API from "../API"
import { GET_DAILY_EVENTS, GET_HOURLY_EVENTS, GET_STATS_DAILY, GET_STATS_HOURLY, GET_POI, ERROR } from "./types"

export const getDailyEventsAsync = () => {
    return dispatch => {
        fetch(`${API}/events/daily`)
            .then(response => response.json())
            .then(data => {
                if(data.error){
                   return dispatch({ type: ERROR, payload: data.error })
                }else{
                   return dispatch(({ type: GET_DAILY_EVENTS, payload: data }))
                }
            })
            .catch(err => console.log("ACTION ERROR getDailyEventsAsync ", err))
    }
} 

export const getHourlyEventsAsync = () => {
    return dispatch => {
        fetch(`${API}/events/hourly`)
            .then(response => response.json())
            .then(data => {
                if(data.error){
                   return dispatch({ type: ERROR, payload: data.error })
                }else{
                   return dispatch(({ type: GET_HOURLY_EVENTS, payload: data }))
                }
            })
            .catch(err => console.log("ACTION ERROR getHourlyEventsAsync ", err))
    }
} 

export const getStatsDailyAsync = () => {
    return dispatch => {
        fetch(`${API}/stats/daily`)
            .then(response => response.json())
            .then(data => {
                if(data.error){
                   return dispatch({ type: ERROR, payload: data.error })
                }else{
                   return dispatch(({ type: GET_STATS_DAILY, payload: data }))
                }
            })
            .catch(err => console.log("ACTION ERROR getStatsDailyAsync ", err))
    }
} 

export const getStatsHourlyAsync = () => {
    return dispatch => {
        fetch(`${API}/stats/hourly`)
            .then(response => response.json())
            .then(data => {
                if(data.error){
                   return dispatch({ type: ERROR, payload: data.error })
                }else{
                   return dispatch(({ type: GET_STATS_HOURLY, payload: data }))
                }
            })
            .catch(err => console.log("ACTION ERROR getStatsHourlyAsync ", err))
    }
}

export const getPoiAsync = () => {
    return dispatch => {
        fetch(`${API}/poi`)
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    dispatch({ type: ERROR, payload: data.error })
                }
                dispatch(({ type: GET_POI, payload: data }))
            })
            .catch(err => console.log("ACTION ERROR getPoiAsync ", err))
    }
}