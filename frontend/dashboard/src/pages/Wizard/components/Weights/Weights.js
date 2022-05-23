// React
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// Actions
import { ACTION as FEATURES } from "../../../../store/tfms/features";

// Components
import {
  Col,
  Row,
  Card,
  CardBody,
  NavLink,
  NavItem,
  Nav,
  TabContent,
  TabPane,
} from "reactstrap";
import Knob from "../../../../components/AllCharts/knob/knob";

// Local Components
import PieChart from "./PieChart";

let timeoutId = 0;

const colors = [
  // dark
  "#3c586b",
  // light
  "#C4CCD3",
  // red
  "#C23531",
  // green
  "#00B050",
  // yellow
  "#FFC000",
  // blue
  "#0070C0",
  // orange
  "#d96e02",
  // pink
  "#E06666",
  // teal
  "#008080",
  // purple
  "#5856D6",
  // brown
  "#964b00",
].concat(
  [
    // dark
    "#3c586b",
    // light
    "#C4CCD3",
    // red
    "#C23531",
    // green
    "#00B050",
    // yellow
    "#FFC000",
    // blue
    "#0070C0",
    // orange
    "#d96e02",
    // pink
    "#E06666",
    // teal
    "#008080",
    // purple
    "#5856D6",
    // brown
    "#964b00",
  ].sort(() => Math.random() - 0.5)
);

const Weights = (props) => {
  const [mainTab, setMainTab] = useState(0);
  const [secondTab, setSecondTab] = useState(0);

  // Features
  const features = props.Features.features;
  const categoricalFeatures = features.filter(
    (feature) => feature.type === "cat"
  );

  const [featuresWeights, setFeaturesWeights] = useState(
    props.Features.featuresWeights
  );
  const [categoriesGrades, setCategoriesGrades] = useState(
    props.Features.categoriesGrades
  );

  const usedFeatures = features.filter(
    (feature) => feature.weight && feature.id in featuresWeights
  );

  useEffect(() => {
    setFeaturesWeights(props.Features.featuresWeights);
    setCategoriesGrades(props.Features.categoriesGrades);
  }, [props.Features.featuresWeights, props.Features.categoriesGrades]);

  const [allFeatures, setAllFeatures] = useState(0);
  const [allGrades, setAllGrades] = useState({});

  const setUpdateTimeout = (func) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, 150);
  };

  return (
    <Card>
      <CardBody>
        <Row>
          <Col>
            <h5>4. {props.t("Configuration")}</h5>
          </Col>
        </Row>
        <Row
          style={{
            marginTop: "15px",
          }}
        >
          <Col>
            <Nav
              tabs
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <NavItem>
                  <NavLink
                    onClick={() => setMainTab(0)}
                    className={mainTab === 0 ? "active" : ""}
                    style={{
                      cursor: "pointer",
                      color: "#cf2e2e",
                      fontWeight: "bold",
                      marginRight: "5px",
                      marginLeft: "1px",
                    }}
                  >
                    <i
                      className={
                        "fas fa-balance-scale" +
                        (mainTab === 0 ? " fa-beat-fade" : "")
                      }
                      style={{}}
                    ></i>
                    <span
                      className="d-none d-xl-inline"
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      {props.t("Features Weights")}
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    onClick={() => setMainTab(1)}
                    className={mainTab === 1 ? "active" : ""}
                    style={{
                      cursor: "pointer",
                      color: "#3835cf",
                      fontWeight: "bold",
                      marginRight: "5px",
                    }}
                  >
                    <i
                      className={
                        "fas fas fa-sliders-h" +
                        (mainTab === 1 ? " fa-beat-fade" : "")
                      }
                    ></i>
                    <span
                      className="d-none d-xl-inline"
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      {props.t("Categories Grades")}
                    </span>
                  </NavLink>
                </NavItem>
              </div>
              <div>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer", color: "#7f879c" }}
                    onClick={() => setMainTab(2)}
                    className={mainTab === 2 ? "active" : ""}
                  >
                    <i
                      className={
                        "fas fa-cog " + (mainTab === 2 ? " fa-spin" : "")
                      }
                    ></i>
                    <span
                      className="d-none d-xl-inline"
                      style={{
                        marginLeft: "8px",
                      }}
                    >
                      {props.t("Settings")}
                    </span>
                  </NavLink>
                </NavItem>
              </div>
            </Nav>
            <TabContent activeTab={mainTab} className="pt-4 p-3 pb-0">
              <TabPane tabId={0}>
                <Row
                  style={{
                    gap: "5px",
                  }}
                >
                  <Col>
                    <h3>{props.t("Features")}</h3>

                    <Row
                      style={{
                        padding: 0,
                      }}
                    >
                      {features.map((feature, i) => (
                        <Col
                          key={i}
                          xxxl={1}
                          xxl={2}
                          xl={3}
                          lg={4}
                          md={6}
                          sm={6}
                          className="text-center knob col-xxxl-1"
                          style={{
                            padding: "40px 0",
                          }}
                        >
                          <h5
                            className="font-size-14 mb-2"
                            style={{
                              width: "calc(100% - 10px)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {props.t(feature.visible_name)}
                          </h5>
                          <Knob
                            title={feature.visible_name}
                            value={featuresWeights?.[feature.id] || 0}
                            onChange={(value) => {
                              const updatedFeaturesWeights = {
                                ...featuresWeights,
                                [feature.id]: value,
                              };
                              setFeaturesWeights(updatedFeaturesWeights);
                              setUpdateTimeout(() =>
                                props.updateFeaturesWeights(
                                  updatedFeaturesWeights
                                )
                              );
                            }}
                            min={-100}
                            step={5}
                            arrowStep={1}
                            max={100}
                            height={100}
                            width={100}
                            fgColor="#cf2e2e"
                            bgColor="#7f879c"
                            lineCap="round"
                            angleOffset={45}
                            angleArc={270}
                            thickness={0.4}
                            cursor={0.5}
                            clockwise={false}
                            stopper={true}
                            disableMouseWheel={true}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Col>
                  <Col
                    xxl={4}
                    xl={12}
                    md={12}
                    style={{
                      padding: 0,
                    }}
                  >
                    {features.length && (
                      <PieChart
                        colors={colors}
                        name="Features"
                        data={usedFeatures
                          .sort(
                            (a, b) => Math.abs(b.weight) - Math.abs(a.weight)
                          )
                          .map((feature) => ({
                            name: feature.visible_name,
                            value: feature.weight,
                          }))}
                      />
                    )}
                  </Col>
                </Row>
              </TabPane>

              <TabPane tabId={1}>
                <Nav
                  tabs
                  className="nav-tabs-custom"
                  style={{
                    borderBottom: 0,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    position: "absolute",
                    top: "-1px",
                    marginLeft: "26%",
                    width: "45%",
                  }}
                >
                  {categoricalFeatures.map((feature, f_i) => (
                    <NavItem key={f_i}>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        onClick={() => setSecondTab(f_i)}
                        className={secondTab === f_i ? "active" : ""}
                      >
                        <i
                          className="mdi mdi-checkbox-multiple-marked-circle-outline"
                          style={{
                            fontSize: "16px",
                          }}
                        ></i>
                        <span
                          className="d-none d-xxl-inline"
                          style={{
                            marginLeft: "8px",
                          }}
                        >
                          {props.t(feature.visible_name)}
                        </span>
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>

                {categoricalFeatures.map((feature, f_i) => (
                  <TabContent
                    activeTab={secondTab}
                    className="text-muted"
                    key={f_i}
                  >
                    <TabPane tabId={f_i} style={{ paddingTop: "0px" }}>
                      <Row
                        style={{
                          gap: "5px",
                        }}
                      >
                        <Col>
                          <h3>{props.t(feature.visible_name)}</h3>

                          <Row>
                            {Object.entries(feature.categories).map(
                              ([category_name], c_i) => (
                                <Col
                                  key={c_i}
                                  xxxl={1}
                                  xxl={2}
                                  xl={3}
                                  lg={4}
                                  md={6}
                                  sm={6}
                                  className="text-center knob col-xxxl-1"
                                  style={{
                                    padding: "40px 0",
                                  }}
                                >
                                  <h5
                                    className="font-size-14 mb-2"
                                    style={{
                                      width: "calc(100% - 10px)",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {props.t(category_name)}
                                  </h5>
                                  <Knob
                                    title={category_name}
                                    value={
                                      categoriesGrades?.[feature.id]?.[
                                        category_name
                                      ] || 0
                                    }
                                    onChange={(value) => {
                                      const updatedCategoriesGrades = {
                                        ...categoriesGrades,
                                        [feature.id]: {
                                          ...categoriesGrades?.[feature.id],
                                          [category_name]: value,
                                        },
                                      };

                                      setCategoriesGrades(
                                        updatedCategoriesGrades
                                      );

                                      setUpdateTimeout(() =>
                                        props.updateCategoriesGrades(
                                          updatedCategoriesGrades
                                        )
                                      );
                                    }}
                                    min={-100}
                                    step={5}
                                    arrowStep={1}
                                    max={100}
                                    height={100}
                                    width={100}
                                    fgColor="#3835cf"
                                    bgColor="#7f879c"
                                    lineCap="round"
                                    angleOffset={45}
                                    angleArc={270}
                                    thickness={0.4}
                                    cursor={0.4}
                                    clockwise={false}
                                    stopper={true}
                                    disableMouseWheel={true}
                                  />
                                </Col>
                              )
                            )}
                          </Row>
                        </Col>
                        <Col
                          xxl={4}
                          xl={12}
                          md={12}
                          style={{
                            padding: 0,
                          }}
                        >
                          {features.length && (
                            <PieChart
                              colors={colors}
                              name={feature.visible_name}
                              data={Object.entries(feature.categories)
                                .filter(([_, value]) => value)
                                .sort(
                                  ([, a], [, b]) => Math.abs(b) - Math.abs(a)
                                )
                                .map(([name, value]) => ({
                                  name,
                                  value,
                                }))}
                            />
                          )}
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                ))}
              </TabPane>

              <TabPane tabId={2}>
                <Row
                  style={{
                    gap: "5px",
                  }}
                >
                  <Col>
                    <Row>
                      <h3>{props.t("Set All")}</h3>

                      <Col
                        xxxl={1}
                        xxl={2}
                        xl={3}
                        lg={4}
                        md={6}
                        sm={6}
                        className="text-center knob col-xxxl-1"
                        style={{
                          padding: "40px 0",
                        }}
                      >
                        <h5 className="font-size-14 mb-2">
                          {props.t("Features")}
                        </h5>

                        <Knob
                          title={props.t("Features")}
                          value={allFeatures}
                          onChange={(value) => {
                            setAllFeatures(value);

                            const updatedFeaturesWeights = Object.assign(
                              {},
                              ...props.Features.features.map((feature) => ({
                                [feature.id]: value,
                              }))
                            );

                            setFeaturesWeights(updatedFeaturesWeights);
                            setUpdateTimeout(() =>
                              props.updateFeaturesWeights(
                                updatedFeaturesWeights
                              )
                            );
                          }}
                          min={-100}
                          step={5}
                          arrowStep={1}
                          max={100}
                          height={100}
                          width={100}
                          fgColor="#cf2e2e"
                          bgColor="#7f879c"
                          lineCap="round"
                          angleOffset={45}
                          angleArc={270}
                          thickness={0.4}
                          cursor={0.5}
                          clockwise={false}
                          stopper={true}
                          disableMouseWheel={true}
                        />
                      </Col>
                      {categoricalFeatures.map((feature, i) => (
                        <Col
                          key={i}
                          xxl={2}
                          xl={"2-5"}
                          lg={4}
                          md={4}
                          sm={6}
                          className="text-center knob col-xxxl-1"
                          style={{
                            padding: "40px 0",
                          }}
                        >
                          <h5 className="font-size-14 mb-2">
                            {`${props.t(feature.visible_name)}`}
                          </h5>
                          <Knob
                            title={feature.visible_name}
                            value={allGrades[feature.id] || 0}
                            onChange={(value) => {
                              setAllGrades({
                                ...allGrades,
                                [feature.id]: value,
                              });

                              setCategoriesGrades((categoriesGrades) => {
                                const newCategoriesGrades = {
                                  ...categoriesGrades,
                                  [feature.id]: Object.assign(
                                    {},
                                    ...Object.entries(feature.categories).map(
                                      ([key, _]) => ({ [key]: value })
                                    )
                                  ),
                                };

                                setUpdateTimeout(() =>
                                  props.updateCategoriesGrades(
                                    newCategoriesGrades
                                  )
                                );

                                return newCategoriesGrades;
                              });
                            }}
                            min={-100}
                            step={5}
                            arrowStep={1}
                            max={100}
                            height={100}
                            width={100}
                            fgColor="#3835cf"
                            bgColor="#7f879c"
                            lineCap="round"
                            angleOffset={45}
                            angleArc={270}
                            thickness={0.4}
                            cursor={0.4}
                            clockwise={false}
                            stopper={true}
                            disableMouseWheel={true}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Col>
                  <Col
                    xxl={4}
                    xl={12}
                    md={12}
                    style={{
                      padding: 0,
                    }}
                  ></Col>
                </Row>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

Weights.propTypes = {
  t: PropTypes.any,
};

const { updateFeaturesWeights, updateCategoriesGrades } = FEATURES;

export default withRouter(
  withTranslation()(
    connect(
      (state) => {
        return {
          TFMS: state.TFMS,
          Programs: state.Programs,
          Features: state.Features,
        };
      },
      { updateFeaturesWeights, updateCategoriesGrades }
    )(Weights)
  )
);
