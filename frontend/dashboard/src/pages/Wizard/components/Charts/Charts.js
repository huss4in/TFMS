// React
import React from "react";
import PropTypes from "prop-types";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// Import components
import { Col, Row, Card, CardTitle, CardBody } from "reactstrap";

// Components
import ReactApexChart from "react-apexcharts";
import { Polar } from "react-chartjs-2";
import ReactEcharts from "echarts-for-react";

// Local Components
import PieChart from "./PieChart";

const colors = Array(2)
  .fill([
    "#cf2e2e", // red
    "#3cb44b", // green
    "#ffe119", // yellow
    "#4363d8", // blue
    "#f58231", // orange
    "#911eb4", // purple
    "#46f0f0", // cyan
    "#f032e6", // magenta
    "#bcf60c", // lime
    "#fabebe", // pink
    "#008080", // teal
    "#e6beff", // lavender
    "#9a6324", // brown
    "#fffac8", // beige
    "#800000", // maroon
    "#aaffc3", // mint
    "#808000", // olive
    "#ffd8b1", // coral
    "#000075", // navy
  ])
  .flat();

const NORMALIZE = (value, min1, max1, min2, max2) => {
  if (value < min1) return min2;
  if (value > max1) return max2;
  if (min1 === max1) return min2;

  return ((value - min1) * (max2 - min2)) / (max1 - min1) + min2;
};

const Charts = (props) => {
  const features = props.Features.features;
  const categoricalFeatures = features.filter(
    (feature) => feature.type === "cat"
  );

  const usedFeatures = features.filter((feature) => feature.weight);
  const usedCategoricalFeatures = usedFeatures.filter(
    (feature) => feature.type === "cat"
  );

  const budget = props.Applicants.budget;
  const budgetSpent = props.Applicants.budgetSpent;
  const budgetRemaining = props.Applicants.budgetRemaining;

  const spendingPercentage = (budgetSpent / budget) * 100 || 0;

  const applicantsWithinBudget = props.Applicants.applicants.slice(
    0,
    props.Applicants.lastApplicantWithinBudgetIndex
  );

  const applicantsWithinBudgetPercentage =
    (applicantsWithinBudget.length / props.Applicants.applicants.length) *
      100 || 0;

  return (
    <Row>
      <Col {...{ xxl: 4, xl: 6, lg: 12 }}>
        <Card>
          <CardBody>
            <CardTitle className="h4 mb-4">
              <h5>{props.t("Budget Distribution")}</h5>
            </CardTitle>

            <ReactApexChart
              type="radialBar"
              height={471}
              series={[
                Math.round(spendingPercentage * 1000) / 1000,
                Math.round(applicantsWithinBudgetPercentage * 1000) / 1000,
              ]}
              options={{
                plotOptions: {
                  radialBar: {
                    hollow: {
                      size: "40%",
                      background: "transparent",
                    },
                    dataLabels: {
                      name: {
                        show: true,
                        fontSize: "22px",
                        color: "#fff",
                      },
                      value: {
                        show: true,
                        fontSize: "16px",
                        color: "#fff",
                      },
                      total: {
                        show: true,
                        label: "Spending",
                        color: "#fff",
                        formatter: (w) =>
                          `${(Math.round(budgetSpent * 1000) / 1000)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} BD`,
                      },
                    },
                  },
                },
                colors: [
                  "hsl(" + (spendingPercentage * 240) / 255 + ",100%,50%)",

                  "hsl(" +
                    (applicantsWithinBudgetPercentage * 240) / 255 +
                    ",100%,50%)",
                ],
                labels: ["Budget", "Applicants"],
                legend: {
                  show: true,
                  floating: true,
                  fontSize: "11px",
                  position: "bottom",
                  // offsetX: "60%",
                  // offsetY: 20,
                  labels: {
                    useSeriesColors: true,
                  },
                  markers: {
                    size: 0,
                  },
                  formatter: function (seriesName, opts) {
                    return (
                      seriesName +
                      ":  " +
                      opts.w.globals.series[opts.seriesIndex]
                    );
                  },
                  itemMargin: {
                    vertical: 3,
                  },
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      legend: {
                        show: true,
                      },
                    },
                  },
                ],
              }}
            />
          </CardBody>
        </Card>
      </Col>

      {categoricalFeatures.map((feature, f_i) => {
        const categoriesBudget = Object.fromEntries(
          Object.keys(feature.categories).map((category) => [category, 0])
        );
        const categoriesApplicants = Object.fromEntries(
          Object.keys(feature.categories).map((category) => [category, 0])
        );

        applicantsWithinBudget.forEach((applicant) => {
          categoriesBudget[applicant[feature.column_name]] +=
            applicant.estimated_fund;
          categoriesApplicants[applicant[feature.column_name]]++;
        });

        const sumBudgets = Object.values(categoriesBudget).reduce(
          (a, b) => a + b,
          0
        );
        const sumApplicants = Object.values(categoriesApplicants).reduce(
          (a, b) => a + b,
          0
        );

        const usedCategories = Object.fromEntries(
          Object.entries(categoriesBudget).filter(
            ([key]) =>
              categoriesBudget[key] !== 0 && categoriesApplicants[key] !== 0
          )
        );

        const categoriesNames = Object.keys(usedCategories);
        const budgetDistribution = Object.values(categoriesBudget)
          .filter((value) => value !== 0)
          .map((value) => Math.round(((100 * value) / sumBudgets) * 100) / 100);
        const applicantsDistribution = Object.values(categoriesApplicants)
          .filter((value) => value !== 0)
          .map(
            (value) => Math.round(((100 * value) / sumApplicants) * 100) / 100
          );

        return (
          <Col {...{ xxl: 4, xl: 6, lg: 12 }} key={f_i}>
            <Card>
              <CardBody>
                <CardTitle className="h4 mb-4">
                  <h5>{`${props.t(feature.visible_name)} ${props.t(
                    "Distribution"
                  )}`}</h5>
                </CardTitle>

                <ReactApexChart
                  type="radar"
                  height={450}
                  series={[
                    {
                      name: "Budget",
                      color: "#3835cf",
                      data: budgetDistribution,
                    },
                    {
                      name: "Applicants",
                      color: "#cf2e2e",
                      data: applicantsDistribution,
                    },
                  ]}
                  options={{
                    chart: {
                      background: "transparent",
                    },
                    plotOptions: {
                      radar: {
                        size: 170,
                        offsetY: 20,
                        polygons: {
                          strokeColor: "#e9e9e9",
                          fill: {
                            colors: ["transparent"],
                          },
                        },
                      },
                    },
                    // dataLabels: {
                    //   enabled: true,
                    //   offsetY: 4,
                    //   style: {
                    //     colors: ["#3835cf", "#cf2e2e"],
                    //     colors: ["white"],
                    //   },
                    //   background: {
                    //     enabled: false,
                    //     opacity: 0.5,
                    //   },
                    // },
                    // fill: {
                    //   opacity: 0.2,
                    // },
                    markers: {
                      size: 5,
                      strokeWidth: 2,
                      strokeColor: "transparent",
                    },
                    tooltip: {
                      y: {
                        formatter: (val) => `${val}%`,
                      },
                    },
                    xaxis: {
                      type: "category",
                      categories: categoriesNames,
                      sorted: true,
                      labels: {
                        show: true,
                        trim: true,
                        hideOverlappingLabels: true,
                      },
                    },
                    yaxis: {
                      tickAmount: 7,
                      labels: {
                        formatter: function (val, i) {
                          if (i % 2 === 0) {
                            return val;
                          } else {
                            return "";
                          }
                        },
                      },
                    },
                  }}
                />
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

Charts.propTypes = {
  t: PropTypes.any,
};

export default withRouter(
  withTranslation()(
    connect((state) => {
      return {
        TFMS: state.TFMS,
        Features: state.Features,
        Run: state.Run,
        Applicants: state.Applicants,
      };
    }, {})(Charts)
  )
);
