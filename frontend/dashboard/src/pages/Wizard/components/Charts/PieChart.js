// React
import React from "react";
import PropTypes from "prop-types";

// Import components
import { Col, Row, Card, CardTitle, CardBody } from "reactstrap";

// Charts
import ReactEcharts from "echarts-for-react";

function PieChart(props) {
  const { colors, name, data } = props;

  return (
    <ReactEcharts
      style={{ height: 400 }}
      option={{
        color: data.length ? colors : ["gray"],
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: false,
            },
            magicType: {
              show: true,
              type: ["pie", "funnel"],
            },
            saveAsImage: {
              show: true,
              title: "Save",
              name: name,
              type: "png",
              pixelRatio: 1,
              backgroundColor: "rgba(0,0,0,0)",
              excludeComponents: ["dataZoom", "toolbox"],
            },
          },
        },

        tooltip: {
          trigger: "item",
          formatter: "{b}: <strong>{d}</strong>%",
        },

        calculable: true,
        legend: {
          data: data,
          orient: "vertical",
          height: "140px",
          icon: "circle",
          x: "0px",
          y: "0px",
          textStyle: {
            fontSize: "8px",
            color: "#ccc",
          },
        },

        series: [
          {
            name: name,
            type: "pie",
            animationDuration: 1000,
            animationEasing: "quarticInOut",
            radius: [1.5 * data.length, 160],
            avoidLabelOverlap: false,
            startAngle: 90,
            hoverOffset: 0,
            center: ["50%", "50%"],
            selectedMode: "multiple",
            label: {
              emphasis: {
                show: true,
              },
            },
            labelLine: {
              normal: {
                show: data.length,
                smooth: true,
                length: 10,
                length2: 10,
                fontSize: "8px",
              },
              emphasis: {
                show: data.length,
              },
            },
            data: data.length
              ? data.map(({ name, value }) => ({
                  name,
                  value: Math.abs(value),
                }))
              : [{ value: 0, name: "None" }],
          },
        ],
      }}
    />
  );
}

export default PieChart;
