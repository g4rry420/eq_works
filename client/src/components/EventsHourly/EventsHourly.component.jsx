import React,{ useLayoutEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import "./EventsHourly.styles.css"
// import LineGraph from "../LineGraph/LineGraph.component"
import { date as modifiedDate, getDay } from "../../dateAndTime"
// import Spinner from "../spinner/spinner.component"

am4core.useTheme(am4themes_animated);

const EventsHourly = (props) => {
  const { hourlyEvents, error } = props;

  const [fromDateValue, setFromDateValue] = useState("2016-12-31");
  const [toDateValue, setToDateValue] = useState("2017-01-06");

  // const eventsHourlyEvents = []
  // const eventsHourlyLabels = []
  // const eventsHourlyHour = []

  useLayoutEffect(() => {
    if(!!!hourlyEvents) return;

    let hourlyEventsData = {};

    hourlyEvents.filter(record => {
      return Date.parse(fromDateValue) <= Date.parse(modifiedDate(record.date)) && Date.parse(toDateValue) >= Date.parse(modifiedDate(record.date))
    }).forEach(record => {
      let date = modifiedDate(record.date);

      let day = getDay(record.date);
      let array;
      if(date === "2016"){
        array = [`${day},  ${record.hour}:00 hs`,record.events, 0, 0];
      }else{
        array = [`${day},  ${record.hour}:00 hs`, 0, record.events, 0];
      }
  
      if (date in hourlyEventsData) {
        hourlyEventsData[date].push(array);
      } else {
        hourlyEventsData[date] = [];
        hourlyEventsData[date].push(array);
      }
    });

    let startYear = 2016;
    let endYear = 2018;
    let currentYear = 2017;
    let colorSet = new am4core.ColorSet();

    let chart = am4core.create("chartdiv", am4charts.RadarChart);
    chart.hiddenState.properties.opacity = 0;

    chart.startAngle = 270 - 180;
    chart.endAngle = 270 + 180;

    chart.padding(5, 15, 5, 10);
    chart.radius = am4core.percent(65);
    chart.innerRadius = am4core.percent(40);

    // year label goes in the middle
    let yearLabel = chart.radarContainer.createChild(am4core.Label);
    yearLabel.horizontalCenter = "middle";
    yearLabel.verticalCenter = "middle";
    yearLabel.fill = am4core.color("#673AB7");
    yearLabel.fontSize = 30;
    yearLabel.text = String(currentYear);

    // zoomout button
    let zoomOutButton = chart.zoomOutButton;
    zoomOutButton.dx = 0;
    zoomOutButton.dy = 0;
    zoomOutButton.marginBottom = 15;
    zoomOutButton.parent = chart.rightAxesContainer;

    // scrollbar
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.rightAxesContainer;
    chart.scrollbarX.orientation = "vertical";
    chart.scrollbarX.align = "center";
    chart.scrollbarX.exportable = false;

    // vertical orientation for zoom out button and scrollbar to be positioned properly
    chart.rightAxesContainer.layout = "vertical";
    chart.rightAxesContainer.padding(120, 20, 120, 20);

    // category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "hour";

    let categoryAxisRenderer = categoryAxis.renderer;
    let categoryAxisLabel = categoryAxisRenderer.labels.template;
    categoryAxisLabel.location = 0.5;
    categoryAxisLabel.radius = 28;
    categoryAxisLabel.relativeRotation = 90;

    categoryAxisRenderer.fontSize = 11;
    categoryAxisRenderer.minGridDistance = 10;
    categoryAxisRenderer.grid.template.radius = -25;
    categoryAxisRenderer.grid.template.strokeOpacity = 0.05;
    categoryAxisRenderer.grid.template.interactionsEnabled = false;

    categoryAxisRenderer.ticks.template.disabled = true;
    categoryAxisRenderer.axisFills.template.disabled = true;
    categoryAxisRenderer.line.disabled = true;

    categoryAxisRenderer.tooltipLocation = 0.5;
    categoryAxis.tooltip.defaultState.properties.opacity = 0;

    // value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 15;
    valueAxis.strictMinMax = true;
    valueAxis.tooltip.defaultState.properties.opacity = 0;
    valueAxis.tooltip.animationDuration = 0;
    valueAxis.cursorTooltipEnabled = true;
    valueAxis.zIndex = 10;

    let valueAxisRenderer = valueAxis.renderer;
    valueAxisRenderer.axisFills.template.disabled = true;
    valueAxisRenderer.ticks.template.disabled = true;
    valueAxisRenderer.minGridDistance = 20;
    valueAxisRenderer.grid.template.strokeOpacity = 0.05;

    // series
    let series = chart.series.push(new am4charts.RadarColumnSeries());
    series.columns.template.width = am4core.percent(90);
    series.columns.template.strokeOpacity = 0;
    series.dataFields.valueY = "value" + currentYear;
    series.dataFields.categoryX = "hour";
    series.tooltipText = "Events: {valueY.value}";

    // this makes columns to be of a different color, depending on value
    series.heatRules.push({
      target: series.columns.template,
      property: "fill",
      minValue: 0,
      maxValue: 15,
      min: am4core.color("#673AB7"),
      max: am4core.color("#F44336"),
      dataField: "valueY"
    });

    // cursor
    let cursor = new am4charts.RadarCursor();
    chart.cursor = cursor;
    cursor.behavior = "zoomX";

    cursor.xAxis = categoryAxis;
    cursor.innerRadius = am4core.percent(40);
    cursor.lineY.disabled = true;

    cursor.lineX.fillOpacity = 0.2;
    cursor.lineX.fill = am4core.color("#000000");
    // cursor.lineX.fill = am4core.color("red");
    cursor.lineX.strokeOpacity = 0;
    cursor.fullWidthLineX = true;


    let axisRange;
    function createRange(name, daysData, index) {
      axisRange = categoryAxis.axisRanges.create();
      axisRange.axisFill.interactionsEnabled = true;
      axisRange.text = name;

      // first hour
      axisRange.category = daysData[0][0];
      // last hour
      axisRange.endCategory = daysData[daysData.length - 1][0];

      // every 3rd color for a bigger contrast
      axisRange.axisFill.fill = colorSet.getIndex(index * Math.ceil(Math.random()));
      axisRange.grid.disabled = true;
      axisRange.label.interactionsEnabled = false;
      axisRange.label.bent = true;

      let axisFill = axisRange.axisFill;
      axisFill.innerRadius = -0.001; // almost the same as 100%, we set it in pixels as later we animate this property to some pixel value
      axisFill.radius = -20; // negative radius means it is calculated from max radius
      axisFill.disabled = false; // as regular fills are disabled, we need to enable this one
      axisFill.fillOpacity = 1;
      axisFill.togglable = true;

      axisFill.showSystemTooltip = true;
      axisFill.readerTitle = "click to zoom";
      axisFill.cursorOverStyle = am4core.MouseCursorStyle.pointer;

      axisFill.events.on("hit", (event) => {
        let dataItem = event.target.dataItem;
        if (!event.target.isActive) {
          categoryAxis.zoom({ start: 0, end: 1 });
        } else {
          categoryAxis.zoomToCategories(
            dataItem.category,
            dataItem.endCategory
          );
        }
      });

      // hover state
      let hoverState = axisFill.states.create("hover");
      hoverState.properties.innerRadius = -10;
      hoverState.properties.radius = -25;

      let axisLabel = axisRange.label;
      axisLabel.location = 0.5;
      axisLabel.fill = am4core.color("#ffffff");
      axisLabel.radius = 3;
      axisLabel.relativeRotation = 0;
    }

    // year slider
    let yearSliderContainer = chart.createChild(am4core.Container);
    yearSliderContainer.layout = "vertical";
    yearSliderContainer.padding(0, 38, 0, 38);
    yearSliderContainer.width = am4core.percent(100);

    let yearSlider = yearSliderContainer.createChild(am4core.Slider);
    yearSlider.events.on("rangechanged", () => {
      updateRadarData(
        startYear + Math.round(yearSlider.start * (endYear - startYear))
      );
    });
    yearSlider.orientation = "horizontal";
    yearSlider.start = 0.5;
    yearSlider.exportable = false;

    chart.data = generateRadarData();

    function generateRadarData() {
      let data = [];
      let i = 0;
      for (let date in hourlyEventsData) {
        let particularDateData = hourlyEventsData[date];

        particularDateData.forEach(hourly => {
          let rawDataItem = { hour: hourly[0] };
          for (let index = 1; index < hourly.length; index++) {
            if(date.slice(0,4) === "2016"){
              rawDataItem["value" + (parseInt(date.slice(0,4)) + index - 2)] = hourly[index];
            }else{
              rawDataItem["value" + (startYear + index - 1)] = hourly[index];
            }
          }

          data.push(rawDataItem);
        });
        createRange(date, particularDateData, i);
        i++;
      }
      console.log(data)
      return data;
    }

    function updateRadarData(year) {
      if (currentYear != year) {
        currentYear = year;
        yearLabel.text = String(currentYear);
        series.dataFields.valueY = "value" + currentYear;
        chart.invalidateRawData();
        // if(series.dataFields.valueY === "value" + 2016){
        //   axisRange.text = "2016-12-31"
        // }
      }
    }

    let slider = yearSliderContainer.createChild(am4core.Slider);
    slider.start = 1;
    slider.exportable = false;
    slider.events.on("rangechanged", () => {
      let start = slider.start;

      chart.startAngle = 270 - start * 179 - 1;
      chart.endAngle = 270 + start * 179 + 1;

      valueAxis.renderer.axisAngle = chart.startAngle;
    });

  },[hourlyEvents, fromDateValue, toDateValue])

  // if(hourlyEvents && !error) {
  //   for (let index = 0; index < hourlyEvents.length; index++) {
  //     const element = hourlyEvents[index];
  //     eventsHourlyEvents.push(element.events);
  //     eventsHourlyLabels.push(dateAndTime(element.date, true))
  //     eventsHourlyHour.push(element.hour);
  //   }
  // }else if(error){
  //   console.log(error)
  // }

  const handleFromDateChange = (e) => {
    setFromDateValue(e.target.value)
  }

  const handleToDateChange = (e) => {
    setToDateValue(e.target.value)
  }

  const maxDate = hourlyEvents && modifiedDate(hourlyEvents[hourlyEvents.length-1].date);

  return (
    <div className="container events-hourly-container">
      {/*<div>
        <select name="charts" id="charts">
          <option value="line">Line</option>
        </select>
      {
        eventsHourlyLabels.length ? (
          <LineGraph 
            type={"line"}
            titleText={`Hourly Events between 2016-2017`}
            labels={eventsHourlyLabels}
            labelHeading={[`Events `, `Hours  `]}
            data={[eventsHourlyEvents, eventsHourlyHour]} />
        ) : error ? <p style={{textAlign: "center"}}> {error} </p> : <Spinner/>
      }*/}
      <div className="row">
        <div className="col-md-12">
          <div className="text-center my-3">
            <h4 className="display-4">Events Hourly</h4>
          </div>
          <h4 className="display-4 date-range">Select Your Date Range:</h4>
          <div className="date-container my-3">
            <label htmlFor="fromDate" className="">From Date</label>
            <input type="date" name="fromDate" id="fromDate" min="2016-12-31" max={maxDate} value={fromDateValue} onChange={handleFromDateChange}   />
          </div>
          <div className="date-container my-3">
            <label htmlFor="toDate" className="">To Date</label>
            <input id="toDate" type="date" name="toDate" min="2016-12-31" max={maxDate} value={toDateValue} onChange={handleToDateChange} />
          </div>
          <div className="text-center mt-4">
            <div id="chartdiv" style={{ width: "100%", height: "850px" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({ 
  hourlyEvents:  state.api.hourlyEvents,
  error: state.api.error
})

export default connect(mapStateToProps, null)(EventsHourly)