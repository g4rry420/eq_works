import React,{ useRef, useState, useCallback, useEffect, Fragment } from 'react'
import { connect } from "react-redux"
import useSupercluster from "use-supercluster"
import MapGl, { FlyToInterpolator,
     Popup, ScaleControl,
    FullscreenControl, NavigationControl, GeolocateControl, Marker } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';

import "./MapBox.styles.css"
import ControlPanel from "./ControlPanel/ControlPanel.component"
// import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from "./Layers/Layers"
import Spinner from "../spinner/spinner.component"
import { date } from "../../dateAndTime"
// import { ReactComponent as LocationLogo } from "../../assets/geo-alt-fill.svg"

const geolocateStyle = {
  top: 0,
  left: 0,
  padding: '10px'
};

const fullscreenControlStyle = {
  top: 36,
  left: 0,
  padding: '10px'
};

const navStyle = {
  top: 72,
  left: 0,
  padding: '10px'
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: '10px'
};

const positionOptions = {enableHighAccuracy: true};

const MapBox = (props) => {
  const { statsHourly, error, poi, hourlyEvents } = props;
  const mapRef = useRef();
  const toDateRef = useRef();

  const [selectValue, setSelectValue] = useState("impressions")
  const [points, setPoints] = useState([]);
  const [fromDateValue, setFromDateValue] = useState("2016-12-31");
  const [toDateValue, setToDateValue] = useState("2017-01-06");
  const [fromHourValue, setFromHourValue] = useState("0");
  const [toHourValue, setToHourValue] = useState("23");

  const [viewport, setViewport] = useState({
    latitude: 48.970874,
    longitude: -101.633790,
    zoom: 3,
    bearing: 0,
    pitch: 0
  })

  const [popupDisplay, setPopupDisplay] = useState(null);

  useEffect(() => {
      if(statsHourly && poi && !error){
      let data = [];
      poi.forEach(poi => {
        data.push({
          type: "Feature",
          properties: {
            cluster: false,
            id: poi.poi_id,
            name: poi.name,
            [selectValue]: sumOfValues(poi.name, selectValue),
            fromDateValue,
            toDateValue
          },
          geometry: {
            type: "Point",
            coordinates: [poi.lon, poi.lat]
          }
        })
      })
      setPoints(data)
    }else if(error){
      console.log(error)
    }
  }, [poi, statsHourly, selectValue, fromDateValue, toDateValue, fromHourValue, toHourValue])  

  useEffect(() => {
    if(selectValue !== "events") return;
    if(!!!toDateRef.current && !!!hourlyEvents) return;
    toDateRef.current.max = date(hourlyEvents[hourlyEvents.length-1].date)
  }, [selectValue])
  
  const onSelectCity = useCallback((data) => {
    setViewport({
      longitude: data.lon,
      latitude: data.lat,
      zoom: 11,
      transitionInterpolator: new FlyToInterpolator({speed: 1.2}),
      transitionDuration: 'auto'
    });
    setTimeout(() => setPopupDisplay(data),[1500])
  }, []);


  // load and prepare data
  // get map bounds
  const bounds = mapRef.current ? mapRef.current.getMap() && mapRef.current.getMap().getBounds().toArray().flat() : null;
  // get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewport.zoom,
    options: { 
      radius: 75,
      maxZoom: 20,
      map: (props) => {
        // return ({
        //   poi: {
        //     name: props.name,
        //     clicks: props.clicks,
        //     lat: props.lat,
        //     lon: props.lon
        //   }
        // })
        return ({
          [selectValue]: props[selectValue],
          name: props.name
        })
      }
      // reduce: (acc, props) => {
      //   if(acc.poi.name === props.poi.name){
      //     // console.log(acc.poi.name + "  " + acc.poi.clicks);
      //     acc.poi.clicks += props.poi.clicks
      //   }
      //   return acc
      // }
     }
  })

  function sumOfValues(name, value){
    if(statsHourly && value !== "events"){
    return statsHourly.reduce((acc, currObj) => {
        
        if(
          (currObj.name === name) && 
          (value !== "revenue") && 
          (Date.parse(fromDateValue) <= Date.parse(date(currObj.date))) && 
          (Date.parse(toDateValue) >= Date.parse(date(currObj.date))) &&
          (parseInt(fromHourValue) <= currObj.hour) && 
          (parseInt(toHourValue) >= currObj.hour)
           ){
          return acc + currObj[value];
        }else if(
          (currObj.name === name) &&
          (value === "revenue") &&
          (Date.parse(fromDateValue) <= Date.parse(date(currObj.date))) && 
          (Date.parse(toDateValue) >= Date.parse(date(currObj.date))) &&
          (parseInt(fromHourValue) <= currObj.hour) && 
          (parseInt(toHourValue) >= currObj.hour) 
          ){
          return acc + Math.floor(currObj[value])
        }
        return acc
      }, 0)
    }else if(value === "events" && hourlyEvents) {
      return hourlyEvents.reduce((acc, currObj) => {
        if(
          (currObj.name === name) &&
          (Date.parse(fromDateValue) <= Date.parse(date(currObj.date))) && 
          (Date.parse(toDateValue) >= Date.parse(date(currObj.date))) &&
          (parseInt(fromHourValue) <= currObj.hour) && 
          (parseInt(toHourValue) >= currObj.hour)
          ){
          return acc + currObj[value];
        }
        return acc
      }, 0)
    }
  }

  const handleClusterClick = (cluster) => {
    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
    setViewport({
      ...viewport,
      latitude: cluster.geometry.coordinates[1],
      longitude: cluster.geometry.coordinates[0],
      zoom: expansionZoom,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
      transitionDuration: "auto"
    })
  }

  const handleMapValueChange = (e) => setSelectValue(e.target.value);
  const handleFromDateChange = (e) => {
    setFromDateValue(e.target.value)
    setPoints([])
  };
  const handleToDateChange = (e) => {
    setToDateValue(e.target.value)
    setPoints([])
  };
  const handleFromHourChange = (e) => {
    setFromHourValue(e.target.value)
    setPoints([])
  }
  const handleToHourChange = (e) => {
    setToHourValue(e.target.value)
    setPoints([])
  }

  // console.log({clusters, points})
  // console.log(fromHourValue, toHourValue)
  const maxDate = statsHourly && date(statsHourly[statsHourly.length-1].date);
  // return map
  return (
    <div>
      <select style={{margin: "2rem"}} name="charts" id="charts" onChange={handleMapValueChange} value={selectValue}>
        <option value="impressions">Impressions</option>
        <option value="clicks">Clicks</option>
        <option value="revenue">Revenue</option>
        <option value="events">Events</option>
      </select>
      {
        ((props.poi !== null) && (props.statsHourly !== null) && (props.error === null)) ? (
          <Fragment>
          <div className="calender-container">
            <input type="date" name="fromDate" min="2016-12-31" max={maxDate} value={fromDateValue} onChange={handleFromDateChange}  />
            <input ref={toDateRef} type="date" name="toDate" min="2016-12-31" max={maxDate} value={toDateValue} onChange={handleToDateChange} />
          </div>
          <div className="hour-container">
            <input type="number" name="fromHour" min="0" max="23" value={fromHourValue} onChange={handleFromHourChange}  />
            <input type="number" name="ToHour" min="0" max="23" value={toHourValue} onChange={handleToHourChange} />
            </div>
          <div className="map-container">
            <MapGl 
            {...viewport} 
            onViewportChange={setViewport}
            maxZoom={20}
            width="80vw"
            height="100vh"
            mapStyle={"mapbox://styles/gurkiransinghk/ckko751ud0rar17n5418ugu9y"}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            ref={mapRef}
            >
            {
              clusters && clusters.map((cluster) => {
                const [longitude, latitude] = cluster.geometry.coordinates;
                const { cluster: isCluster,
                  point_count,
                    name,fromDateValue,
                    toDateValue
                  } = cluster.properties;
                  // console.log(cluster.properties[selectValue])
                if(isCluster) {
                  return (
                    <Marker 
                      key={cluster.id}
                      latitude={latitude} longitude={longitude}>
                      <div 
                        className="cluster-marker"
                        onClick={() => handleClusterClick(cluster)}
                        style={{ 
                        width: `${10 + (point_count / points.length) * 30}px`,
                        height: `${10 + (point_count / points.length) * 30}px`,
                        cursor: "pointer"}}>
                        {`${point_count} POI's`}
                      </div>
                    </Marker>
                  )
                }else if(cluster.properties[selectValue]){  
                  const widthAndHeight = cluster.properties[selectValue].toString().length > 5
                  ? parseInt(cluster.properties[selectValue].toString().substring(0, 3))
                  : cluster.properties[selectValue].toString().length > 2    
                  ? parseInt(cluster.properties[selectValue].toString().substring(0, 2))
                  : point_count

                  return (
                    <Marker 
                      key={cluster.properties.id}
                      latitude={latitude}
                      longitude={longitude}>
                      <div style={{color: "white", cursor: "pointer"}} onClick={() => {
                        const data = {
                          name: name,
                          lat: latitude,
                          lon: longitude,
                        }
                        setPopupDisplay(data)
                      }}>
                        <div 
                          className="cluster-marker"
                          style={{ 
                          width: `${( widthAndHeight / points.length) - 10}px`,
                          height: `${(widthAndHeight / points.length) - 10}px`,
                          cursor: "pointer"}}>
                          {/* console.log(cluster.properties[selectValue]) */}
                          {cluster.properties[selectValue]}
                        </div>
                      </div>
                    </Marker>
                  )
                }
              })
              }
            {
              popupDisplay && (
                <Popup latitude={popupDisplay.lat} longitude={popupDisplay.lon} onClose={() => setPopupDisplay(null)}>
                  <div> {popupDisplay.name} </div>
                </Popup>
              )
            }
            <GeolocateControl style={geolocateStyle} positionOptions={positionOptions} trackUserLocation />
            <FullscreenControl style={fullscreenControlStyle} />
            <NavigationControl style={navStyle} />
            <ScaleControl style={scaleControlStyle} />
            <ControlPanel onSelectCity={onSelectCity}  />
          </MapGl>
        </div>
        </Fragment>
        ) : props.error ? <p style={{textAlign: "center"}}> {props.error} </p> : <Spinner/>
      }
    </div>
    )
}

const mapStateToProps = state => ({
  poi: state.api.poi,
  error: state.api.error,
  statsHourly: state.api.statsHourly,
  hourlyEvents: state.api.hourlyEvents
})

export default connect(mapStateToProps, null)(MapBox)