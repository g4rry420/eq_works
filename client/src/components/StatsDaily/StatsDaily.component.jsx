import React,{ useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { motion } from "framer-motion"

import "./StatsDaily.styles.css"
import { dateAndTime } from "../../dateAndTime"
import Spinner from "../spinner/spinner.component"

am4core.useTheme(am4themes_animated);

const containerVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
        delay: 1.5,
        duration: 1.5
        }
    },
    exit: {
        x: "-100vw",
        transition: {
        ease: "easeInOut"
        }
    }
}

function StatsDaily(props) {
    const { statsDaily, error } = props

    useLayoutEffect(() => {
        if(!!!statsDaily) return;

        const chart = am4core.create("chartDivStatsDaily", am4charts.XYChart);

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

    return (
        <div className="text-center mt-5">
            <motion.h4 className="display-4 my-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            >Statistics per Week</motion.h4>
        {
            statsDaily ? (
                <motion.div className="text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                >
                    <div id="chartDivStatsDaily" style={{ width: "95%", height: "500px" }}></div>
                </motion.div>
            ) : error ? <p style={{textAlign: "center"}}> {error} </p> : <Spinner/>
        }
        </div>
    )
}

const mapStateToProps = state => ({ 
    statsDaily:  state.api.statsDaily,
    error: state.api.error
})

export default connect(mapStateToProps, null)(StatsDaily)