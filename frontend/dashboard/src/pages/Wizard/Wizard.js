// Import react
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// Actions
import { ACTION as ESTIMATION } from "../../store/tfms/estimation";

// Local Components
import Title from "../../components/Page/Common/Title";
import FundEstimation from "./components/FundEstimation";
import Weights from "./components/Weights";
import Charts from "./components/Charts";
import Applicants from "./components/Applicants";
import SaveRun from "./components/SaveRun";

const Wizard = (props) => {
  console.log("Wizard", props);

  return (
    <div className="page-content">
      <Title
        {...(props.Run.id !== null
          ? {
              title: `${props.t("Run")}: ${props.Run.id}`,
              subtitle: `${props.t("Date")}: ${new Date(
                (props.Run.date + 60 * 60 * 3) * 1000
              )
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")}`,
            }
          : { title: "Wizard" })}
      />

      <FundEstimation />

      {props.Estimation.status === "completed" && <Weights />}
      {props.Estimation.status === "completed" && <Charts />}
      {props.Estimation.status === "completed" && <Applicants />}
      {props.Estimation.status === "completed" && <SaveRun />}
    </div>
  );
};

const { fetchEstimation } = ESTIMATION;

export default withRouter(
  withTranslation()(
    connect(
      (state) => {
        return {
          TFMS: state.TFMS,
          Programs: state.Programs,
          Estimation: state.Estimation,
          Features: state.Features,
          Applicants: state.Applicants,
          Run: state.Run,
        };
      },
      {
        fetchEstimation,
      }
    )(Wizard)
  )
);
