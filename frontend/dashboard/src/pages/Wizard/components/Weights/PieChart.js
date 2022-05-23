// React
import React from "react";
import PropTypes from "prop-types";

// Import components
import { Col, Row, Card, CardTitle, CardBody } from "reactstrap";

// Charts
import ReactEcharts from "echarts-for-react";

function PieChart(props) {
  const { colors, name } = props;

  const data = props.data.length
    ? props.data.map(({ name, value }) => ({
        name,
        value: Math.abs(value),
      }))
    : [{ value: 0, name: "None" }];

  return (
    <ReactEcharts
      style={{ height: "100%", minHeight: "500px" }}
      option={{
        color: data?.[0].name !== "None" ? colors : ["gray"],
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
              name,
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
          height: "120px",
          icon: "circle",
          x: "0px",
          y: "10px",
          textStyle: {
            fontSize: 11,
            color: "#ccc",
          },
        },

        series: [
          {
            name,
            type: "pie",
            animationDuration: 1000,
            animationEasing: "quarticInOut",
            radius: [1.5 * data.length, 170],
            avoidLabelOverlap: false,
            startAngle: 90,
            hoverOffset: 0,
            center: ["50%", "60%"],
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
            data,
          },
        ],
      }}
    />
  );
}

export default PieChart;
