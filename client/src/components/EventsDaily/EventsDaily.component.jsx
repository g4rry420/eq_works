import React,{ useState, useLayoutEffect, useRef } from 'react'
import { connect } from 'react-redux';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// import LineGraph from "../LineGraph/LineGraph.component"
import { dateAndTime } from "../../dateAndTime"
// import Spinner from "../spinner/spinner.component"

am4core.useTheme(am4themes_animated);


function EventsDaily(props) {
    const { dailyEvents, error } = props;
    const chart = useRef(null);

    // const [type, setType] = useState("bar");

    useLayoutEffect(() => {
      if(!!!dailyEvents) return;

      let x = am4core.create("chartdiv", am4charts.XYChart);


      chart.current = x
  
  
      x.paddingRight = 20;
      let data = [];

      dailyEvents.forEach(daily => {
        const date = dateAndTime(daily.date, true)
        data.push({ date, events: daily.events,  href: "" })
      })
  
      x.data = data;
  
      const categoryAxis = x.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "date";
      // categoryAxis.title.text = "Date";
      categoryAxis.renderer.grid.template.strokeOpacity = 0; // removes the line behind bar
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.renderer.labels.template.dy = 35;
      categoryAxis.renderer.tooltip.dy = 35;
      categoryAxis.renderer.labels.template.rotation = 35;

      const valueAxis = x.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.title.text = "Events per Week";
      valueAxis.renderer.inside = true; /// y axis value renders inside
      valueAxis.renderer.labels.template.fillOpacity = 0.3; ///y axis value opacity decreases
      valueAxis.renderer.grid.template.strokeOpacity = 0; // removes the line behind bar
      valueAxis.min = 0;  //gives starting value from 0
      valueAxis.cursorTooltipEnabled = false; 
      valueAxis.renderer.baseGrid.strokeOpacity = 0;  // removes line at the bottom which holds bars

      const series = x.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = "date";
      series.dataFields.valueY = "events";
      series.tooltipText = `{valueY.value} events/day`;
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.dy = -6;
      series.columnsContainer.zIndex = 100;
      // series.columns.template.stroke = am4core.color("#ff0000"); // red outline
      // series.columns.template.fill = am4core.color("#00ff00"); // green fill

      const columnTemplate = series.columns.template;  ///selects a particular column of series
      columnTemplate.width = am4core.percent(50);
      columnTemplate.maxWidth = 46;
      columnTemplate.column.cornerRadius(60, 60, 10, 10);
      columnTemplate.strokeOpacity = 0;

      series.heatRules.push({
        target: columnTemplate,
        property: "fill",
        dataField: "valueY",
        min: am4core.color("#46aa82"),
        max: am4core.color("#4676aa")
      });
      series.mainContainer.mask = undefined;

      const cursor = new am4charts.XYCursor();
      x.cursor = cursor;
      cursor.lineX.disabled = true;
      cursor.lineY.disabled = true;
      cursor.behavior = "none";

      const bullet = columnTemplate.createChild(am4charts.CircleBullet);
      bullet.circle.radius = 30;
      bullet.valign = "bottom";
      bullet.align = "center";
      bullet.isMeasured = true;
      bullet.mouseEnabled = false;
      bullet.verticalCenter = "bottom";
      bullet.interactionsEnabled = false;

      const hoverState = bullet.states.create("hover");
      const outlineCircle = bullet.createChild(am4core.Circle);
      outlineCircle.adapter.add("radius", function(radius, target) {
        let circleBullet = target.parent;
        return circleBullet.circle.pixelRadius + 10;
      });

      const image = bullet.createChild(am4core.Image);
      image.width = 60;
      image.height = 60;
      image.horizontalCenter = "middle";
      image.verticalCenter = "middle";
      image.propertyFields.href = "href";

      image.adapter.add("mask", function(mask, target) {
        let circleBullet = target.parent;
        return circleBullet.circle;
      });

      let previousBullet;
      x.cursor.events.on("cursorpositionchanged", function(event) {
        let dataItem = series.tooltipDataItem;

        if (dataItem.column) {
          let bullet = dataItem.column.children.getIndex(1);

          if (previousBullet && previousBullet != bullet) {
            previousBullet.isHover = false;
          }

          if (previousBullet != bullet) {
            let hs = bullet.states.getKey("hover");
            hs.properties.dy = -bullet.parent.pixelHeight + 30;
            bullet.isHover = true;

            previousBullet = bullet;
          }
        }
      });

      chart.current = x;
  
  
      return () => x.dispose();
    },[dailyEvents])

    // const labels = [];
    // const events = [];
    // if(dailyEvents && !error){
    //   for (let index = 0; index < dailyEvents.length; index++) {
    //     const element = dailyEvents[index];
    //     labels.push(dateAndTime(element.date, false))
    //     events.push(element.events)
    //   }
    // }else if(error){
    //   console.log(error)
    // }

    // const handleChartOptionChange = (e) => {
    //   setType(e.target.value);
    // }


    return (
        <div className="container text-center">
         {/* <select name="charts" id="charts" onChange={handleChartOptionChange} value={type}>
            <option value="line">Line</option>
            <option value="bar" >Bar</option>
            <option value="horizontalBar">Horizontal Bar</option>
            <option value="radar">Radar</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
          </select>
        {
            events.length ? (
            <LineGraph 
                type={type}
                titleText={`Daily Events between 2016-2017`}
                labels={labels} 
                data={[events]} 
                labelHeading={[`Events `]} />
            ) : error ? <p style={{textAlign: "center"}}> {error} </p> : <Spinner/>
          } */}

          <h4 className="display-4 my-5">Events Daily</h4>
          <div className="text-center">
            <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
          </div>
        </div>
    )
}

const mapStateToProps = state => ({
  dailyEvents:  state.api.dailyEvents,
  error: state.api.error
})

export default connect(mapStateToProps, null)(EventsDaily)