import React,{ useRef, useState, useCallback } from 'react'
import { connect } from "react-redux"
import MapGl, { FlyToInterpolator,
    Source, Layer, Popup, ScaleControl,
    FullscreenControl, NavigationControl, GeolocateControl } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';

import "./MapBox.styles.css"
import ControlPanel from "./ControlPanel/ControlPanel.component"
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from "./Layers/Layers"
import Spinner from "../spinner/spinner.component"

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


function MapBox(props) {
  const mapRef = useRef();

  const [viewport, setViewport] = useState({
    latitude: 48.970874,
    longitude: -101.633790,
    zoom: 3,
    bearing: 0,
    pitch: 0
  })

  const [popupDisplay, setPopupDisplay] = useState(null);
  const [radioButton, setRadioButton] = useState("");

  const geojson = {
    features: []
  }

  if(props.poi && !props.error){
    for (let index = 0; index < props.poi.length; index++) {
      const element = props.poi[index];
      geojson.features.push({ type: "Feature", properties: { id: element.poi_id, name: element.name }, geometry: { type: "Point", coordinates: [element.lon, element.lat] } })
    }
  }else if(props.error){
    console.log(props.error)
  }

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


  const handleMapClick = (event) => {
    const feature = event.features[0];
    if(!!!feature) return;
    const clusterId = feature.properties.cluster_id;

    const mapBoxSource = mapRef.current.getMap().getSource("eventsAndStats");

    mapBoxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if(err){
        return console.log("Error in handleMapClick")
      }

      setViewport({
        ...viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 500
      })

    })
  }

  // load and prepare data
  // const points = [];
  // if(props.poi && !props.error){
  //   for (let index = 0; index < props.poi.length; index++) {
  //     const element = props.poi[index];
  //     points.push({
  //       type: "Feature",
  //       properties: { cluster: false, poi_id: element.poi_id, name: element.name },
  //       geometry: {
  //         type: "Point",
  //         coordinates: [element.lon, element.lat]
  //       }
  //     })
  //   }
  // }
  // get map bounds
  // let bounds;
  // if(mapRef.current){
  //   bounds = mapRef.current.getMap().getBounds().toArray().flat();
  // }else{
  //   bounds = []
  // }
  // // get clusters
  // const { clusters, supercluster } = useSupercluster({
  //   points,
  //   bounds,
  //   zoom: viewport.zoom,
  //   options: { radius: 75, maxZoom: 20 }
  // })

  // console.log({ points, clusters })
  // return map
  return (
    <div>
      {
        ((props.poi !== null) && (props.error === null)) ? (
        <MapGl 
        {...viewport} 
        onViewportChange={setViewport}
        maxZoom={20}
        width="100vw"
        height="100vh"
        mapboxApiAccessToken={process.env.NODE_ENV === "development" ? "pk.eyJ1IjoiZ3Vya2lyYW5zaW5naGsiLCJhIjoiY2trbjJraXczMDVmYjJvcDU1bDRhMThjeCJ9._2ac1Xjtc_0ahJDnxHtU9A" : process.env.REACT_APP_MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id]}
        ref={mapRef}
        onClick={handleMapClick}
        >

        <Source
          id="eventsAndStats"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}>
          <Layer { ...clusterLayer } />
          <Layer { ...clusterCountLayer } />
          <Layer { ...unclusteredPointLayer } />
        </Source>

        {/*
          props.poi && props.poi.map(data => (
            <Marker latitude={data.lat} longitude={data.lon} key={data.poi_id}>
              <div style={{color: "transparent", cursor: "pointer", visibility: ""}} onClick={() => handleOpenPopUp(data)}>
                hello
              </div>
            </Marker>
          ))
          */}
        {
          popupDisplay && (
            <Popup latitude={popupDisplay.lat} longitude={popupDisplay.lon} onClose={() => setPopupDisplay(null)}>
              <div> {popupDisplay.name} </div>
            </Popup>
          )
        }
        <GeolocateControl style={geolocateStyle} />
        <FullscreenControl style={fullscreenControlStyle} />
        <NavigationControl style={navStyle} />
        <ScaleControl style={scaleControlStyle} />
        <ControlPanel onSelectCity={onSelectCity} radioButton={radioButton} setRadioButton={radioButton} />
      </MapGl>
        ) : props.error ? <p style={{textAlign: "center"}}> {props.error} </p> : <Spinner/>
      }
    </div>
    )
}

const mapStateToProps = state => ({
  poi: state.api.poi,
  error: state.api.error
})

export default connect(mapStateToProps, null)(MapBox)