import React,{ useState, useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import LineGraph from "../LineGraph/LineGraph.component"
import { dateAndTime } from "../../dateAndTime"
import Spinner from "../spinner/spinner.component"

am4core.useTheme(am4themes_animated);

function StatsDaily(props) {
    const { statsDaily, error } = props
    // const [type, setType] = useState("bar");

    // const statsDailyLabels = [];
    // const statsDailyImpressions = [];
    // const statsDailyClicks = [];
    // const statsDailyRevenue = [];


    useLayoutEffect(() => {
        if(!!!statsDaily) return;

        const chart = am4core.create("chartdiv", am4charts.XYChart);

        let data = [];
        statsDaily.forEach(stats => {
            data.push({
                date: dateAndTime(stats.date, true),
                impressions: stats.impressions,
                clicks: stats.clicks,
                revenue: Math.floor(stats.revenue)
            })
        })

        chart.data = data;

        chart.legend = new am4charts.Legend();

        // Create axes
        const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "date";
        categoryAxis.numberFormatter.numberFormat = "#";
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.cellStartLocation = 0.1;
        categoryAxis.renderer.cellEndLocation = 0.9;

        const valueAxis = chart.xAxes.push(new am4charts.ValueAxis()); 
        valueAxis.renderer.opposite = true;
        valueAxis.cursorTooltipEnabled = false;
        // Create series
        const createSeries = (field, name) => {
            const series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueX = field;
            series.dataFields.categoryY = 'date';
            series.name = name;
            series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
            // series.columns.template.height = am4core.percent(100);
            series.sequencedInterpolation = true
            series.tooltip.dy = -6
            series.columnsContainer.zIndex = 100;

            if(name === "Revenue"){
                series.tooltip.dy = 16
            }


            const columnTemplate = series.columns.template;
            columnTemplate.width = am4core.percent(100);
            columnTemplate.height = am4core.percent(100)
            columnTemplate.maxWidth = 46;
            columnTemplate.maxHeight = 100;
            columnTemplate.column.cornerRadius(60, 60, 10, 10);
            columnTemplate.strokeOpacity = 0;
        }

        const cursor = new am4charts.XYCursor();
        chart.cursor = cursor;
        cursor.lineX.disabled = true;
        cursor.lineY.disabled = true;
        cursor.behavior = "none";

        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarY = new am4core.Scrollbar()

        createSeries("impressions", "Impressions")
        createSeries("clicks", "Clicks")
        createSeries("revenue", "Revenue")

        return () =>  chart.dispose();
    }, [statsDaily])

    // if(statsDaily && !error){
    //     for (let index = 0; index < statsDaily.length; index++) {
    //         const element = statsDaily[index];
    //         statsDailyLabels.push(dateAndTime(element.date, false));
    //         statsDailyImpressions.push(element.impressions);
    //         statsDailyClicks.push(element.clicks);
    //         statsDailyRevenue.push(element.revenue);
    //     }
    // }else if(error){
    //     console.log(error)
    // }

    // const handleChartOptionChange = (e) => {
    //     setType(e.target.value)
    // }

    return (
        <div className="container text-center">
            {/*<select name="charts" id="charts" onChange={handleChartOptionChange} value={type}>
                <option value="line">Line</option>
                <option value="bar">Bar</option>
                <option value="horizontalBar">Horizontal Bar</option>
                <option value="radar">Radar</option>
            </select>
        {
            statsDailyLabels.length ? (
                <LineGraph 
                    type={type}
                    titleText={`Daily Stats between 2016-2017`}
                    labels={statsDailyLabels}
                    labelHeading={[`Clicks`, `Impressions`, `Revenue`]}
                    data={[statsDailyClicks, statsDailyImpressions, statsDailyRevenue]} />



            ) : error ? <p style={{textAlign: "center"}}> {error} </p> : <Spinner/>
        }*/}
        <h4 className="display-4 my-5">Stats Daily</h4>
        <div className="text-center">
            <div id="chartdiv" style={{ width: "95%", height: "500px" }}></div>
        </div>

        </div>
    )
}

const mapStateToProps = state => ({ 
    statsDaily:  state.api.statsDaily,
    error: state.api.error
})

export default connect(mapStateToProps, null)(StatsDaily)