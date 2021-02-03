import React, { useEffect, useRef, useState, Fragment } from 'react'
import Chart from "chart.js"

import "./LineGraph.styles.css"
import CustomButton from "../custom-button/custom-button.component"

Chart.defaults.global.defaultFontFamily = "'Roboto', sans-serif";
// Chart.defaults.global.legend.display = false;
// Chart.defaults.global.elements.line.tension = 0;

const LineGraph = (props) => {
    const chartRef = useRef();
    const curvedAndStraightLineRef = useRef();

    const [steppedLine, setSteppedLine] = useState(false);
    const [curvedAndStraightLine, setCurvedAndStraightLine] = useState(false);

    const { data, labels, labelHeading, titleText, type } = props;
    useEffect(() => {
        if(!chartRef.current) return;
        const myChartRef = chartRef.current.getContext("2d");

        const myChart = new Chart(myChartRef, {
            type: type,
            data: {
                //Bring in Data
                labels,
                datasets: [
                    { label: labelHeading[0], data: data[0], fill: false, borderColor: "#98B9AB", backgroundColor: (type === "bar" || "pie") && labelHeading.length === 1 ? ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "cyan", "maroon"] :  "#3e95cd", steppedLine: steppedLine, lineTension: curvedAndStraightLine },
                    { label: labelHeading[1] , data: data[1], borderColor: "#8e5ea2", backgroundColor: "#e8c3b9", hidden: true, steppedLine: steppedLine, lineTension: curvedAndStraightLine },
                    { label: labelHeading[2] , data: data[2], backgroundColor: "#3cba9f", hidden: true, steppedLine: steppedLine, lineTension: curvedAndStraightLine },
                    { label: labelHeading[3] , data: data[3], backgroundColor: "#c45850", hidden: true, steppedLine: steppedLine, lineTension: curvedAndStraightLine }
                ]
            },
            options: {
                //Customize chart options
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        ticks: { display: (type === "pie" || type === "radar" || type === "doughnut") ? false : true },
                        gridLines: {
                            display:  (type === "pie" || type === "radar" || type === "doughnut") ? false : true,
                            drawBorder: (type === "pie" || type === "radar" || type === "doughnut") ? false : true
                        },
                        // stacked: true
                    }],
                    yAxes: [{
                        ticks: { display: (type === "pie" || type === "radar" || type === "doughnut") ? false : true },
                        gridLines: {
                            display: (type === "pie" || type === "radar" || type === "doughnut") ? false : true,
                            drawBorder: (type === "pie" || type === "radar" || type === "doughnut") ? false : true
                        },
                        // stacked: true
                    }]
                },
                title: {
                    display: true,
                    text: titleText
                },
                legend: {
                    labels: {
                        filter: function (item, chart){
                            return item.text !== undefined;
                        },
                    }
                }
                
            }
        })

        return () => myChart.destroy();
    },[props, steppedLine, curvedAndStraightLine])

    useEffect(() => {
        if(!curvedAndStraightLineRef.current) return;

        if(steppedLine){
            curvedAndStraightLineRef.current.disabled = true;
            curvedAndStraightLineRef.current.style.opacity = 0.6;
            curvedAndStraightLineRef.current.style.pointerEvents = "none";
        }else{
            curvedAndStraightLineRef.current.disabled = false;
            curvedAndStraightLineRef.current.style.opacity = 1;
            curvedAndStraightLineRef.current.style.pointerEvents = "initial";
        }
    }, [steppedLine])


    const handleSteppedLine = () => setSteppedLine(prevState => !prevState);
    const handleCurvedAndStraightLine = () => setCurvedAndStraightLine(prevState => !prevState);
    return (
        <div>
        {
            type === "line" && (
                <Fragment>
                    <div onClick={handleSteppedLine} style={{marginTop: "1rem"}}>
                        <CustomButton title={`Toggle between SteppedLine`} type={`button`} />
                    </div>
                    <div onClick={handleCurvedAndStraightLine} style={{marginTop: "1rem"}}>
                        <CustomButton title={`Toggle between Curved and Straight Line`} type={`button`} ref={curvedAndStraightLineRef} />
                    </div>
                </Fragment>
            )
        }
            <div className="linegraph-container" style={{position: "relative"}}>
                <canvas id="myChart" ref={chartRef}/>
            </div>
        </div>
    )
}

export default LineGraph