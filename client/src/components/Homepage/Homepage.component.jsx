import React,{ useEffect, useRef, Fragment, useState } from 'react'
import { connect } from 'react-redux';
import { Table } from "react-bootstrap"

import "./Homepage.styles.css"
import { date } from "../../dateAndTime"
import Spinner from "../spinner/spinner.component"
import Pagination from "../Pagination/Pagination.component"

const Homepage = (props) => {
    const [searchField, setSearchField] = useState("");
    const searchedNameRef = useRef();
    const searchedNameRowRef = useRef();

    const [pagination, setPagination] = useState([]);
    const [pagination2, setPagination2] = useState([]);
    const [initialPagination, setInitialPagination] = useState(1);
    const [initialPagination2, setInitialPagination2] = useState(1);

    const numberOfRowsToShow = 20;

    const { dailyEvents, hourlyEvents, statsDaily, statsHourly, poi, error } = props;

    useEffect(() => {
        if(!!!hourlyEvents) return;

        let data = [];
        for (let index = 1; index <= Math.ceil(hourlyEvents.length / numberOfRowsToShow); index++) {
            data.push(index)
        }
        setPagination(data)
        setPagination2(data)
    },[hourlyEvents])

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

    const handleNextPagination = () => {
        setInitialPagination(prevState => {
            if(prevState === (pagination.length)) return prevState;

            return prevState + 1;
        });
    }

    const handleNextPagination2 = () => {
        setInitialPagination2(prevState => {
            if(prevState === (pagination.length)) return prevState;

            return prevState + 1;
        });
    }

    const handlePrevPagination = () => {
        setInitialPagination(prevState => {
            if(prevState === 1) return prevState;

            return prevState - 1;
        });
    }

    const handlePrevPagination2 = () => {
        setInitialPagination2(prevState => {
            if(prevState === 1) return prevState;

            return prevState - 1;
        });
    }

    const handleFirstPagination = () => setInitialPagination(1);
    const handleFirstPagination2 = () => setInitialPagination2(1);

    const handleLastPagination = () => setInitialPagination(pagination.length);
    const handleLastPagination2 = () => setInitialPagination2(pagination.length);

    const handlePaginationNumberClick = (number) => setInitialPagination(number);
    const handlePaginationNumberClick2 = (number) => setInitialPagination2(number);
    

    const indexOfLastRow = initialPagination * numberOfRowsToShow;
    const indexOfLastRow2 = initialPagination2 * numberOfRowsToShow;

    const indexOfFirstRow = indexOfLastRow - numberOfRowsToShow;
    const indexOfFirstRow2 = indexOfLastRow2 - numberOfRowsToShow;

    return (
        <div className="container">
        {
            ((dailyEvents !== null) && (hourlyEvents !== null) && (statsDaily !== null) && (statsHourly !== null) && (poi !== null)) ? (
                <Fragment>
                    <div className="homepage-search-container">
                        <input type="search" placeholder="Search through Poi..." onChange={handleSearchChange} value={searchField} />
                    </div>
                <Table bordered>
                    <thead>
                        <tr>
                        <th colSpan={4} style={{textAlign: "center"}}>Poi</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                    </tr>
                    {
                        searchedPoi && searchedPoi.map((entry, idx) => (
                        <tr key={entry.poi_id} ref={el => searchedNameRowRef.current[idx] = el}>
                            <td ref={el => searchedNameRef.current[idx] = el}>{entry.name}</td>
                            <td>{entry.lat}</td>
                            <td> {entry.lon} </td>
                        </tr>
                        ))
                    }
                    </tbody>
                </Table>
                <div className="homepage-table-container">
                    <div className="homepage-table-sub-container">
                        <Table bordered>
                        <thead>
                            <tr>
                            <th colSpan={3} style={{textAlign: "center"}}>Daily Events</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Date & Time</th>
                            <th>Events</th>
                        </tr>
                        {
                            dailyEvents && dailyEvents.map((entry, idx) => (
                            <tr key={idx}>
                                <td> {date(entry.date)} </td>
                                <td>{entry.events}</td>
                            </tr>
                            ))
                        }
                        </tbody>
                        </Table>
                    </div>

                    <div className="homepage-table-sub-container">
                        <Table bordered>
                        <thead>
                            <tr>
                            <th colSpan={5} style={{textAlign: "center"}}>Daily Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Date & Time</th>
                            <th>Impressions</th>
                            <th>Clicks</th>
                            <th>Revenue</th>
                        </tr>
                        {
                            statsDaily && statsDaily.map((entry, idx) => (
                            <tr key={idx}>
                                <td>{date(entry.date)}</td>
                                <td>{entry.impressions}</td>
                                <td>{entry.clicks}</td>
                                <td> {Math.floor(entry.revenue)} </td>
                            </tr>
                            ))
                        }
                        </tbody>
                        </Table>
                    </div>

                </div>
                        
    
                <div className="homepage-table-container" id="homepage-table-container">
                    <div className="homepage-table-sub-container">
                        <div className="text-center">
                            <Pagination 
                                handleFirstPagination={handleFirstPagination}
                                handlePrevPagination={handlePrevPagination}
                                pagination={pagination}
                                initialPagination={initialPagination}
                                handlePaginationNumberClick={handlePaginationNumberClick}
                                handleNextPagination={handleNextPagination}
                                handleLastPagination={handleLastPagination}
                            />
                        </div>
                        <Table bordered>
                        <thead>
                            <tr>
                            <th colSpan={5} style={{textAlign: "center"}}>Hourly Events</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Date & Time</th>
                            <th>Events</th>
                            <th>Hours</th>
                        </tr>
                        {
                            hourlyEvents && hourlyEvents.slice(indexOfFirstRow, indexOfLastRow).map((entry, idx) => (
                            <tr key={idx}>
                                <td>{date(entry.date)}</td>
                                <td>{entry.events}</td>
                                <td> {entry.hour} </td>
                            </tr>
                            ))
                        }
                        </tbody>
                        </Table>
                    </div>
                    
                    <div className="homepage-table-sub-container">
                        <div className="text-center">
                            <Pagination 
                                handleFirstPagination={handleFirstPagination2}
                                handlePrevPagination={handlePrevPagination2}
                                pagination={pagination2}
                                initialPagination={initialPagination2}
                                handlePaginationNumberClick={handlePaginationNumberClick2}
                                handleNextPagination={handleNextPagination2}
                                handleLastPagination={handleLastPagination2}
                            />
                        </div>
                        <Table bordered>
                        <thead>
                            <tr>
                            <th colSpan={6} style={{textAlign: "center"}}>Hourly Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Date & Time</th>
                            <th>Impressions</th>
                            <th>Clicks</th>
                            <th>Revenue</th>
                            <th>Hours</th>
                        </tr>
                        {
                            statsHourly && statsHourly.slice(indexOfFirstRow2, indexOfLastRow2).map((entry, idx) => (
                            <tr key={idx}>
                                <td>{date(entry.date)}</td>
                                <td>{entry.impressions}</td>
                                <td>{entry.clicks}</td>
                                <td> {Math.floor(entry.revenue)} </td>
                                <td> {entry.hour} </td>
                            </tr>
                            ))
                        }
                        </tbody>
                        </Table>
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