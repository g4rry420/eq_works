import React,{ useRef, useState, useCallback } from 'react'
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
  const mapRef = useRef();

  const [viewport, setViewport] = useState({
    latitude: 48.970874,
    longitude: -101.633790,
    zoom: 3,
    bearing: 0,
    pitch: 0
  })

  const [popupDisplay, setPopupDisplay] = useState(null);

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


  // const handleMapClick = (event) => {
  //   const feature = event.features[0];
  //   if(!!!feature) return;
  //   const clusterId = feature.properties.cluster_id;

  //   const mapBoxSource = mapRef.current.getMap().getSource("eventsAndStats");

  //   mapBoxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
  //     if(err){
  //       return console.log("Error in handleMapClick")
  //     }

  //     setViewport({
  //       ...viewport,
  //       longitude: feature.geometry.coordinates[0],
  //       latitude: feature.geometry.coordinates[1],
  //       zoom,
  //       transitionDuration: 500
  //     })

  //   })
  // }

  // load and prepare data
  const points = [];
  if(props.poi && !props.error){
    for (let index = 0; index < props.poi.length; index++) {
      const element = props.poi[index];
      points.push({
        type: "Feature",
        properties: { cluster: false, poi_id: element.poi_id, name: element.name },
        geometry: {
          type: "Point",
          coordinates: [element.lon, element.lat]
        }
      })
    }
  }
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
    points,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 75, maxZoom: 20 }
  })

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
        mapStyle={"mapbox://styles/gurkiransinghk/ckko751ud0rar17n5418ugu9y"}
        mapboxApiAccessToken={process.env.NODE_ENV === "development" ? "" : process.env.REACT_APP_MAPBOX_TOKEN}
        ref={mapRef}
        // interactiveLayerIds={[clusterLayer.id]}
        // onClick={handleMapClick}
        >

        {/*<Source
          id="eventsAndStats"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}>
          <Layer { ...clusterLayer } />
          <Layer { ...clusterCountLayer } />
          <Layer { ...unclusteredPointLayer } />
        </Source>*/}

        

        {
          clusters && clusters.map(cluster => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count, name } = cluster.properties;

            if(isCluster) {
              return (
                <Marker key={cluster.id} latitude={latitude} longitude={longitude}>
                  <div 
                    className="cluster-marker"
                    onClick={() => handleClusterClick(cluster)}
                    style={{ 
                    width: `${10 + (point_count / points.length) * 20}px`,
                    height: `${10 + (point_count / points.length) * 20}px`,
                    cursor: "pointer"}}>
                    {point_count}
                  </div>
                </Marker>
              )
            }

            return (
              <Marker 
                key={cluster.properties.poi_id}
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
                  <LocationLogo/>
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
  error: state.api.error
})

export default connect(mapStateToProps, null)(MapBox)