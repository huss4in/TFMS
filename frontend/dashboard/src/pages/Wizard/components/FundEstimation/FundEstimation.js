// Import React
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// Actions
import { ACTION as PROGRAMS } from "../../../../store/tfms/programs";
import { ACTION as ESTIMATION } from "../../../../store/tfms/estimation";
import { ACTION as RUN } from "../../../../store/tfms/run";

// Components
import Select from "react-select";
import { Col, Row, Card, CardBody, Button, Spinner } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

const FundEstimation = (props) => {
  const [programPeriods, setProgramPeriods] = useState(props.Programs.programs);

  useEffect(() => {
    setProgramPeriods(
      props.Programs.programs.map(({ id, program_name, periods }) => ({
        label: program_name,
        options: periods.map((period_name) => ({
          label:
            props.t("Arabic") === "العربية"
              ? `${period_name} - ${props.t(program_name)}`
              : `${props.t(program_name)} - ${period_name}`,
          value: {
            program_id: id,
            program_name,
            period_name,
          },
        })),
      }))
    );
  }, [props.t, props.Programs.programs]);

  useEffect(() => {
    if (!props.Programs.isPeriodSelected) return;

    const program_id = props.Programs.period.value.program_id;
    const program_name = props.Programs.period.value.program_name;
    const period_name = props.t(props.Programs.period.value.period_name);

    props.updatePeriod({
      label:
        props.t("Arabic") === "العربية"
          ? `${period_name} - ${program_name}`
          : `${program_name} - ${period_name}`,
      value: {
        program_name,
        program_id,
        period_name,
      },
    });
  }, [props.t]);

  const statusComponent = (status) => {
    switch (status.toLowerCase()) {
      case "not started":
        return (
          <i
            className="mdi mdi-close text-danger"
            style={{
              fontSize: "40px",
            }}
          />
        );

      case "in progress":
        return (
          <Spinner
            type="grow"
            color="warning"
            style={{
              animationDuration: "1.5s",
              animationTimingFunction: "cubic-bezier(0.4, 0, 1, 1)",
            }}
          ></Spinner>
        );

      case "completed":
        return (
          <i
            className="mdi mdi-check text-success"
            style={{
              fontSize: "40px",
            }}
          />
        );

      default:
        return (
          <Spinner
            style={{
              animationDuration: ".5s",
              animationTimingFunction: "cubic-bezier(0.4, 0, 1, 1)",
            }}
          ></Spinner>
        );
    }
  };

  return (
    <Row>
      <Col>
        <Card>
          <CardBody
            style={{
              direction: props.t("Arabic") === "العربية" ? "rtl" : "ltr",
            }}
          >
            <h5
              style={{
                paddingBottom: "20px",
                margin: 0,
              }}
            >
              {`1. ${props.t("Choose")}: ${props.t("Program - Period")}`}
            </h5>

            <Select
              options={programPeriods}
              value={
                props.Programs.isPeriodSelected ? props.Programs.period : null
              }
              onChange={(value) => props.selectPeriod(value)}
              classNamePrefix="select2-selection"
            />
          </CardBody>
        </Card>
      </Col>

      {props.Estimation.status === "completed" && (
        <Col xxl={4} xl={6}>
          <Card>
            <CardBody
              style={{
                direction: props.t("Arabic") === "العربية" ? "rtl" : "ltr",
              }}
            >
              <h5
                style={{
                  paddingBottom: "20px",
                  margin: 0,
                }}
              >
                {`3. ${props.t("Budget")}:`}
              </h5>

              <AvForm>
                <AvField
                  style={{
                    margin: 0,
                  }}
                  name="number"
                  type="number"
                  value={props.Run.budget}
                  placeholder={props.t("0 BD")}
                  errorMessage={props.t("Please enter a valid budget")}
                  validate={{
                    required: { value: true },
                    pattern: {
                      value: "^[+]?([\\d]*[.])?[\\d]+$",
                      errorMessage: props.t("Please enter a valid budget"),
                    },
                  }}
                  onChange={(event) => {
                    console.log(event);

                    try {
                      props.updateBudget(Number(event.target.value));
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                />
              </AvForm>
            </CardBody>
          </Card>
        </Col>
      )}

      {props.Programs.isPeriodSelected && (
        <Col xxl={4} xl={12}>
          <Card>
            <CardBody
              style={{
                direction: props.t("Arabic") === "العربية" ? "rtl" : "ltr",
              }}
            >
              <h5
                style={{
                  paddingBottom: "20px",
                  margin: 0,
                }}
              >
                <span>2. {props.t("Fund Estimation")}:</span>

                <span
                  style={{
                    margin: "0 25px",
                    fontSize: "12px",
                  }}
                >
                  {props.Estimation.status === "completed"
                    ? new Date((props.Estimation.time + 60 * 60 * 3) * 1000)
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " ")
                    : props.t(
                        props.Estimation.status.replace(
                          /\w\S*/g,
                          (txt) =>
                            txt.charAt(0).toUpperCase() +
                            txt.substr(1).toLowerCase()
                        )
                      )}
                </span>
              </h5>

              <Row>
                <Col
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "30px",
                  }}
                >
                  <Button
                    disabled={
                      !(
                        props.Estimation.status === "completed" ||
                        props.Estimation.status === "not started"
                      )
                    }
                    color="primary"
                    outline
                    className="waves-effect waves-light"
                    onClick={() => {
                      console.log("Run Bulk Estimation");
                      props.startEstimation();
                    }}
                  >
                    {props.t("Run Bulk Estimation")}
                  </Button>

                  {statusComponent(props.Estimation.status)}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      )}
    </Row>
  );
};

const { selectPeriod, updatePeriod } = PROGRAMS;
const { startEstimation } = ESTIMATION;
const { updateBudget } = RUN;

export default withRouter(
  withTranslation()(
    connect(
      (state) => ({
        Programs: state.Programs,
        Estimation: state.Estimation,
        Run: state.Run,
      }),
      {
        selectPeriod,
        updatePeriod,
        startEstimation,
        updateBudget,
      }
    )(FundEstimation)
  )
);
