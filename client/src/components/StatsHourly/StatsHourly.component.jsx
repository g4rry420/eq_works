import React,{ useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import LineGraph from "../LineGraph/LineGraph.component"
import { dateAndTime, date as modifiedDate } from "../../dateAndTime"
import Spinner from "../spinner/spinner.component"

am4core.useTheme(am4themes_animated);

const StatsHourly = (props) => {
    const { statsHourly, error }= props;

    const statsHourlyLabels = [];
    const statsHourlyImpressions = [];
    const statsHourlyClicks = [];
    const statsHourlyRevenue = [];
    const statsHourlyHour = []; 

    if(statsHourly && !error){
        for (let index = 0; index < statsHourly.length; index++) {
            const element = statsHourly[index];
            statsHourlyLabels.push(dateAndTime(element.date, true));
            statsHourlyImpressions.push(element.impressions)
            statsHourlyClicks.push(element.clicks)
            statsHourlyRevenue.push(element.revenue);
            statsHourlyHour.push(element.hour)
        }
    }else if(error){
        console.log(error)
    }

    useLayoutEffect(() => {
        if(!!!statsHourly) return;

        let data = []

        statsHourly.forEach(stats => {
            const date = modifiedDate(stats.date);
            const impressions = stats.impressions;
            const revenue = Math.floor(stats.revenue);
            const clicks = stats.clicks

            data.push({ date, impressions})
        })

        const chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.scrollbarX = new am4core.Scrollbar();

        chart.data = data;
        // prepareParetoData();

        // function prepareParetoData(){
        //     var total = 0;

        //     for(var i = 0; i < chart.data.length; i++){
        //         var value = chart.data[i].visits;
        //         total += value;
        //     }

        //     var sum = 0;
        //     for(var i = 0; i < chart.data.length; i++){
        //         var value = chart.data[i].visits;
        //         sum += value;   
        //         chart.data[i].pareto = sum / total * 100;
        //     }    
        // }

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "date";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 60;
        categoryAxis.tooltip.disabled = true;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "impressions";
        series.dataFields.categoryX = "date";
        series.columns.template.tooltipText = "[{categoryX}: bold]{valueY}[/]";
        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.8;

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        // series.columns.template.adapter.add("fill", (fill, target) => {
        // return chart.colors.getIndex(target.dataItem.index);
        // })


        // var paretoValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // paretoValueAxis.renderer.opposite = true;
        // paretoValueAxis.min = 0;
        // paretoValueAxis.max = 100;
        // paretoValueAxis.strictMinMax = true;
        // paretoValueAxis.renderer.grid.template.disabled = true;
        // paretoValueAxis.numberFormatter = new am4core.NumberFormatter();
        // paretoValueAxis.numberFormatter.numberFormat = "#'%'"
        // paretoValueAxis.cursorTooltipEnabled = false;

        // var paretoSeries = chart.series.push(new am4charts.LineSeries())
        // paretoSeries.dataFields.valueY = "clicks";
        // paretoSeries.dataFields.categoryX = "date";
        // paretoSeries.yAxis = paretoValueAxis;
        // paretoSeries.tooltipText = "pareto: {valueY.formatNumber('#.0')}%[/]";
        // paretoSeries.bullets.push(new am4charts.CircleBullet());
        // paretoSeries.strokeWidth = 2;
        // paretoSeries.stroke = new am4core.InterfaceColorSet().getFor("alternativeBackground");
        // paretoSeries.strokeOpacity = 0.5;

        // var paretoSeries2 = chart.series.push(new am4charts.LineSeries())
        // paretoSeries2.dataFields.valueY = "revenue";
        // paretoSeries2.dataFields.categoryX = "date";
        // paretoSeries2.yAxis = paretoValueAxis;
        // paretoSeries2.tooltipText = "pareto: {valueY.formatNumber('#.0')}%[/]";
        // paretoSeries2.bullets.push(new am4charts.CircleBullet());
        // paretoSeries2.strokeWidth = 2;
        // paretoSeries2.stroke = new am4core.InterfaceColorSet().getFor("alternativeBackground");
        // paretoSeries2.strokeOpacity = 0.5;

        // Cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "panX";


        return () =>  chart.dispose();
    },[statsHourly])

    return (
        <div className="container">
        <select name="charts" id="charts">
          <option value="line" selected>Line</option>
        </select>
        {
            statsHourlyLabels.length ? (
                <LineGraph
                    type={"line"}
                    titleText={`Hourly Stats between 2016-2017`} 
                    labels={statsHourlyLabels}
                    labelHeading={[`Clicks`, `Impressions`, `Revenue`, `Hours`]}
                    data={[statsHourlyClicks, statsHourlyImpressions, statsHourlyRevenue, statsHourlyHour]} />
            ) : error ? <p style={{textAlign: "center"}}> {error} </p> : <Spinner/>
        }
        <div className="text-center mt-4">
            <div id="chartdiv" style={{ width: "100%", height: "850px" }}></div>
        </div>
        </div>
    )
}

const mapStateToProps = state => ({
    statsHourly:  state.api.statsHourly,
    error: state.api.error
})

export default connect(mapStateToProps, null)(StatsHourly)