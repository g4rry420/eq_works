import { GET_DAILY_EVENTS, GET_HOURLY_EVENTS, GET_STATS_DAILY, GET_STATS_HOURLY, GET_POI, ERROR } from "../actions/types"

const INITIALSTATE = {
    dailyEvents: null,
    hourlyEvents: null,
    statsDaily: null,
    statsHourly: null,
    poi: null,
    error: null
}

const apiReducer = (state = INITIALSTATE, action) => {
    switch(action.type){
        case GET_DAILY_EVENTS:
            return {
                ...state,
                dailyEvents: action.payload
            }
        case GET_HOURLY_EVENTS:
            return {
                ...state,
                hourlyEvents: action.payload
            }
        case GET_STATS_DAILY:
            return {
                ...state,
                statsDaily: action.payload
            }
        case GET_STATS_HOURLY:
            return {
                ...state,
                statsHourly: action.payload
            }
        case GET_POI:
            return {
                ...state,
                poi: action.payload
            }
        case ERROR:
            return{
                ...state,
                error: action.payload
            }
        default:
            return state
    }
}

export default apiReducer