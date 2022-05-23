// Import react
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// Actions
import { ACTION as RUN } from "../../../store/tfms/run";

// Components
import { Card, CardBody, Button } from "reactstrap";
import { Link } from "react-router-dom";

function SaveRun(props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        marginBottom: "10px",
      }}
    >
      <Link
        to="/"
        className="btn btn-success"
        onClick={() => {
          props.postRun();
          console.log("Post Run");
        }}
      >
        <i
          className="fas fa-save"
          style={{
            marginRight: "5px",
          }}
        ></i>
        {props.t("Save Run")}
      </Link>
    </div>
  );
}

const { postRun } = RUN;

export default withRouter(
  withTranslation()(
    connect(
      (state) => {
        return {
          TFMS: state.TFMS,
          Run: state.Run,
        };
      },
      { postRun }
    )(SaveRun)
  )
);

// export default SaveRun;
