import  React from 'react';
import { connect } from "react-redux"

import "./ControlPanel.styles.css"

function ControlPanel({ poi, onSelectCity, error }) {
  return (
    <div className="control-panel">
      <h3>Select Your POI's</h3>
      

      {((poi !== null) && (error === null) ) && poi.map((data, index) => (
        <div key={data.poi_id} className="input">
          <input
            type="radio"
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