import React,{ useRef, useState, useCallback, useEffect } from 'react'
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
import { ReactComponent as LocationLogo } from "../../assets/geo-alt-fill.svg"

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

function MapBox(props) {
  const { statsHourly, error, poi } = props;
  const mapRef = useRef();

  const [selectValue, setSelectValue] = useState("clicks")
  const [currentMapState, setCurrentMapState] = useState([]);

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
      // statsHourly.forEach(hourly => {
      //   Object.keys(hourly).filter(key => {
      //     if(key === selectValue){
      //       data.push({ 
      //         type: "Feature",
      //         properties: {
      //           cluster: false,
      //           id: hourly.poi_id,
      //           name: hourly.name,
      //           [key]: hourly[key],
      //           lat: hourly.lat,
      //           lon: hourly.lon
      //         },
      //         geometry: {
      //           type: "Point",
      //           coordinates: [hourly.lon, hourly.lat]
      //         }
      //        })
      //     }
      //   });
      // })
      poi.forEach(poi => {
        data.push({
          type: "Feature",
          properties: {
            cluster: false,
            id: poi.poi_id,
            name: poi.name,
            [selectValue]: sumOfValues(poi.name),
            lat: poi.lat,
            lon: poi.lon
          },
          geometry: {
            type: "Point",
            coordinates: [poi.lon, poi.lat]
          }
        })
      })
      setCurrentMapState(data)
    }else if(error){
      console.log(error)
    }
  }, [statsHourly, selectValue])  

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
  const bounds = mapRef.current
  ? mapRef.current
      .getMap()
      .getBounds()
      .toArray()
      .flat()
  : null;
  // get clusters
  const { clusters, supercluster } = useSupercluster({
    points: currentMapState,
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

  // clusters.forEach(cluster => console.log(cluster))

  statsHourly && statsHourly.reduce((acc, curr) => {
    // if(curr.name === "Niagara Falls"){
      // console.log(acc + "  " + curr.clicks);
      return acc + curr.clicks
    // }
  },0)

  const groupBy = (objectArray, property, selectData) => {
    const namesArray = objectArray.reduce((acc, currObj) => {
      const key = currObj[property]
      if(!acc[key]){
        acc[key] = []
      }
      acc[key].push(currObj)
      return acc
    }, {})

    // return Object.keys(namesArray).map(key => {
    //   return namesArray[key].reduce((acc, currObj) => {
    //     let value = acc + currObj[selectData]
    //     return {
    //       [currObj.name]: value
    //     }
    //   }, 0)
    // })
  }

  function sumOfValues(name){
    if(!!!statsHourly) return;
    return statsHourly.reduce((acc, currObj) => {
      if(currObj.name === name){
        return acc + currObj[selectValue]
      }
      return acc
    }, 0)
  }

  // statsHourly && groupBy(statsHourly, "name", "clicks")

  const handleClusterClick = (cluster) => {
    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 16);
    setViewport({
      ...viewport,
      latitude: cluster.geometry.coordinates[1],
      longitude: cluster.geometry.coordinates[0],
      zoom: expansionZoom,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
      transitionDuration: "auto"
    })
  }

  const handleMapValueChange = (e) => {
    setSelectValue(e.target.value)
  }
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
        ((props.poi !== null) && (props.statsHourly) && (props.error === null)) ? (
        <MapGl 
        {...viewport} 
        onViewportChange={setViewport}
        maxZoom={20}
        width="100vw"
        height="100vh"
        mapStyle={"mapbox://styles/gurkiransinghk/ckko751ud0rar17n5418ugu9y"}
        mapboxApiAccessToken={process.env.NODE_ENV === "development" ? "pk.eyJ1IjoiZ3Vya2lyYW5zaW5naGsiLCJhIjoiY2trbjJraXczMDVmYjJvcDU1bDRhMThjeCJ9._2ac1Xjtc_0ahJDnxHtU9A" : process.env.REACT_APP_MAPBOX_TOKEN}
        ref={mapRef}
        >

        

        {
          clusters && clusters.map((cluster, index) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster,
               point_count,
                name, clicks
               } = cluster.properties;
            // const { clicks, lat, lon, name } = cluster.properties.poi
            console.log({point_count, clicks})
            if(isCluster) {
              return (
                <Marker 
                  // key={cluster.id}
                  key={index}
                  latitude={latitude} longitude={longitude}>
                  <div 
                    className="cluster-marker"
                    onClick={() => handleClusterClick(cluster)}
                    style={{ 
                    width: `${10 + (point_count / currentMapState.length) * 30}px`,
                    height: `${10 + (point_count / currentMapState.length) * 30}px`,
                    cursor: "pointer"}}>
                    {`${point_count} POI's`}
                  </div>
                </Marker>
              )
            }

            return (
              <Marker 
                // key={cluster.properties.poi_id}
                key={index}
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
                  {/*<LocationLogo/>*/}
                  <div 
                    className="cluster-marker"
                    onClick={() => handleClusterClick(cluster)}
                    style={{ 
                    width: `${10 + (point_count / currentMapState.length) * 10}px`,
                    height: `${10 + (point_count / currentMapState.length) * 10}px`,
                    cursor: "pointer"}}>
                    {clicks}
                  </div>
                </div>
              </Marker>
            )

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
        ) : props.error ? <p style={{textAlign: "center"}}> {props.error} </p> : <Spinner/>
      }
    </div>
    )
}

const mapStateToProps = state => ({
  poi: state.api.poi,
  error: state.api.error,
  statsHourly: state.api.statsHourly
})

export default connect(mapStateToProps, null)(MapBox)