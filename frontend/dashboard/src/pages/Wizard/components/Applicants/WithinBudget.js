// Import react
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// Components
import { MDBDataTableV5 } from "mdbreact";
import { CSVLink } from "react-csv";
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
  CardTitle,
} from "reactstrap";

function WithinBudget(props) {
  return (
    <Row
      style={{
        paddingTop: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <CSVLink
          data={props.data}
          filename={
            new Date()
              .toLocaleDateString("en-US")
              .split("/")
              .reverse()
              .join("-") +
            "-" +
            props.Programs.period?.label.split(/\s+/).join("") +
            " " +
            (props.within ? "(within budget)" : "(outside budget)") +
            ".csv"
          }
        >
          Export CSV
        </CSVLink>
      </div>

      <MDBDataTableV5
        id="Applicants"
        data={{
          columns: props.columns,
          rows: props.data,
        }}
        barReverse={false}
        bordered={false}
        borderless={false}
        entriesLabel=""
        dark
        displayEntries
        exportToCSV
        hover
        info
        sortable
        responsive
        striped
        entriesOptions={[10, 50, 100, 500, 1000]}
      />
    </Row>
  );
}
export default withRouter(
  withTranslation()(
    connect((state) => {
      return {
        TFMS: state.TFMS,
        Programs: state.Programs,
      };
    }, {})(WithinBudget)
  )
);
