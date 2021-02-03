import React,{ useEffect, useRef, Fragment, useState, memo } from 'react'
import { connect } from 'react-redux';
import { Link } from "react-router-dom"

import "./Homepage.styles.css"
import { dateAndTime } from "../../dateAndTime"
import Spinner from "../spinner/spinner.component"
import CustomButton from "../custom-button/custom-button.component"

const Homepage = (props) => {
    const [searchField, setSearchField] = useState("");
    const searchedNameRef = useRef();
    const searchedNameRowRef = useRef();

    const { dailyEvents, hourlyEvents, statsDaily, statsHourly, poi, error } = props;
    const handleSearchChange = (e) => {
        setSearchField(e.target.value);
    }

    let searchedPoi;
    if(poi && !error){
    searchedPoi = poi.filter(data => {
        return data.name.toLowerCase().includes(searchField);
    })

    searchedNameRef.current = new Array(searchedPoi.length);
    searchedNameRowRef.current = new Array(searchedPoi.length);
    }else if(error){
        console.log(error)
    }

    useEffect(() => {
    if(!searchedNameRef.current && !searchedNameRowRef.current) return;
    searchedNameRef.current.forEach(name => {
        if(name){
        markHighlightedText(name, name.textContent)
        }
    })
    
    searchedNameRowRef.current.forEach(row => {
        if(row && searchField.length){
        row.classList.add("homepage-row-bg-color")
        }else if(row) {
        row.classList.remove("homepage-row-bg-color")
        }
    })
    
    }, [searchedPoi, searchedNameRowRef])

    const markHighlightedText = (container, text) => {
    let newText = text.replace(new RegExp(searchField, "gi"), match => `<mark>${match}</mark>`);
    container.innerHTML = newText
    }
    console.log((dailyEvents !== null) && (hourlyEvents !== null) && (statsDaily !== null) && (statsHourly !== null) && (poi !== null))
    return (
        <div>
        {
            ((dailyEvents !== null) && (hourlyEvents !== null) && (statsDaily !== null) && (statsHourly !== null) && (poi !== null)) ? (
                <Fragment>
                    <div className="homepage-search-container">
                        <input type="search" placeholder="Search through Poi..." onChange={handleSearchChange} value={searchField} />
                    </div>
                <table>
                    <thead>
                        <tr>
                        <th colSpan={4} style={{textAlign: "center"}}>Poi</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>Sr No</th>
                        <th>Name</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                    </tr>
                    {
                        searchedPoi && searchedPoi.map((entry, idx) => (
                        <tr key={entry.poi_id} ref={el => searchedNameRowRef.current[idx] = el}>
                            <td> {idx + 1} </td>
                            <td ref={el => searchedNameRef.current[idx] = el}>{entry.name}</td>
                            <td>{entry.lat}</td>
                            <td> {entry.lon} </td>
                        </tr>
                        ))
                    }
                    </tbody>
                </table>
                <Link to="/map" style={{marginTop: "1rem", display: "block"}}>
                    <CustomButton title={"See Geo Visual Representation of POI'S"} type={`button`} />
                </Link>
                <div className="homepage-table-container">
                    <div className="homepage-table-sub-container">
                        <table>
                        <thead>
                            <tr>
                            <th colSpan={3} style={{textAlign: "center"}}>Daily Events</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Sr No</th>
                            <th>Date & Time</th>
                            <th>Events</th>
                        </tr>
                        {
                            dailyEvents && dailyEvents.map((entry, idx) => (
                            <tr key={idx}>
                                <td> {idx + 1} </td>
                                <td> {dateAndTime(entry.date, false)} </td>
                                <td>{entry.events}</td>
                            </tr>
                            ))
                        }
                        </tbody>
                        </table>
                        <Link to="/events/daily">
                            <CustomButton title={"See Visual Representation of Daily Events"} type={`button`} />
                        </Link>
                    </div>

                    <div className="homepage-table-sub-container">
                        <table>
                        <thead>
                            <tr>
                            <th colSpan={5} style={{textAlign: "center"}}>Daily Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Sr No</th>
                            <th>Date & Time</th>
                            <th>Impressions</th>
                            <th>Clicks</th>
                            <th>Revenue</th>
                        </tr>
                        {
                            statsDaily && statsDaily.map((entry, idx) => (
                            <tr key={idx}>
                                <td> {idx + 1} </td>
                                <td>{dateAndTime(entry.date, false)}</td>
                                <td>{entry.impressions}</td>
                                <td>{entry.clicks}</td>
                                <td> {entry.revenue} </td>
                            </tr>
                            ))
                        }
                        </tbody>
                        </table>
                        <Link to="/stats/daily">
                            <CustomButton title={"See Visual Representation of Daily Stats"} type={`button`} />
                        </Link>
                    </div>

                </div>
    
    
                <div className="homepage-table-container" id="homepage-table-container">
                    <div className="homepage-table-sub-container">
                        <table>
                        <thead>
                            <tr>
                            <th colSpan={5} style={{textAlign: "center"}}>Hourly Events</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Sr No</th>
                            <th>Date & Time</th>
                            <th>Events</th>
                            <th>Hours</th>
                        </tr>
                        {
                            hourlyEvents && hourlyEvents.map((entry, idx) => (
                            <tr key={idx}>
                                <td> {idx + 1} </td>
                                <td>{dateAndTime(entry.date, false)}</td>
                                <td>{entry.events}</td>
                                <td> {entry.hour} </td>
                            </tr>
                            ))
                        }
                        </tbody>
                        </table>
                        <Link to="/events/hourly">
                            <CustomButton title={"See Visual Representation of Hourly Events"} type={`button`} />
                        </Link>
                    </div>
                    
                    <div className="homepage-table-sub-container">
                        <table>
                        <thead>
                            <tr>
                            <th colSpan={6} style={{textAlign: "center"}}>Hourly Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Sr No</th>
                            <th>Date & Time</th>
                            <th>Impressions</th>
                            <th>Clicks</th>
                            <th>Revenue</th>
                            <th>Hours</th>
                        </tr>
                        {
                            statsHourly && statsHourly.map((entry, idx) => (
                            <tr key={idx}>
                                <td> {idx + 1} </td>
                                <td>{dateAndTime(entry.date, false)}</td>
                                <td>{entry.impressions}</td>
                                <td>{entry.clicks}</td>
                                <td> {entry.revenue} </td>
                                <td> {entry.hour} </td>
                            </tr>
                            ))
                        }
                        </tbody>
                        </table>
                        <Link to="/stats/hourly">
                            <CustomButton title={"See Visual Representation of Hourly Stats"} type={`button`} />
                        </Link>
                    </div>


                </div>
                </Fragment>
              ) : error ? <p style={{textAlign: "center"}}> {error} </p> : <Spinner/>
        }            
        </div>
    )
}

const mapStateToProps = state => ({
    dailyEvents:  state.api.dailyEvents, 
    hourlyEvents:  state.api.hourlyEvents, 
    statsDaily:  state.api.statsDaily,
    statsHourly:  state.api.statsHourly, 
    poi:  state.api.poi, 
    error: state.api.error
})

export default connect(mapStateToProps, null)(Homepage)