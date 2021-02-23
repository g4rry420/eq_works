import  React from 'react';
import { connect } from "react-redux"

import "./ControlPanel.styles.css"

function ControlPanel({ poi, onSelectCity, error }) {
  return (
    <div className="control-panel">
      <h5>Select Your POI's</h5>
      

      {((poi !== null) && (error === null) ) && poi.map((data, index) => (
        <div key={data.poi_id} className="input">
          <input
            type="radio"
            className="mr-2"
            name="city"
            id={data.poi_id}
            onClick={() => onSelectCity(data)}
          />
          <label htmlFor={`city-${index}`}>{data.name}</label>
        </div>
      ))}
    </div>
  );
}

const mapStateToProps = (state) => ({
    poi: state.api.poi,
    error: state.api.error
})

export default connect(mapStateToProps, null)(React.memo(ControlPanel));