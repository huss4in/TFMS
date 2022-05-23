// Import react
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

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
  CardTitle,
} from "reactstrap";

// Local Components
import WithinBudget from "./WithinBudget";

const Applicants = (props) => {
  const columns = [
    { label: "ID", field: "id" },
    ...[...props.Features.features]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 8)
      .filter((feature) => feature.column_name !== "estimated_fund")
      .map((feature) => ({
        label: feature.visible_name,
        field: feature.column_name,
        width: feature.visible_name.length,
      })),
    { label: "Estimated Fund", field: "estimated_fund" },
    { label: "Score", field: "score", sort: "dec" },
  ];

  const applicants = props.Applicants.applicants;
  const separator = props.Applicants.lastApplicantWithinBudgetIndex;

  const budgetUnderflow = separator === 0;
  const budgetOverflow = applicants.length === separator;

  useEffect(() => {
    setMainTab(budgetUnderflow && !budgetOverflow ? 1 : 0);
  }, [applicants]);

  const [mainTab, setMainTab] = useState(0);

  return (
    <Card>
      <CardBody>
        <CardTitle>
          <h5
            style={{
              margin: 0,
            }}
          >
            {props.t("Applicants")}
          </h5>
        </CardTitle>
        <Row>
          <Col>
            <Nav tabs className="nav-tabs-custom nav-justified">
              {!budgetUnderflow && (
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    onClick={() => setMainTab(0)}
                    className={mainTab === 0 ? "active" : ""}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">
                      {props.t("Within Budget")}
                    </span>
                  </NavLink>
                </NavItem>
              )}

              {!budgetOverflow && (
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    onClick={() => setMainTab(1)}
                    className={mainTab === 1 ? "active" : ""}
                  >
                    <span className="d-block d-sm-none">
                      <i className="far fa-user"></i>
                    </span>
                    <span className="d-none d-sm-block">
                      {props.t("Outside Budget")}
                    </span>
                  </NavLink>
                </NavItem>
              )}
            </Nav>
            <TabContent activeTab={mainTab} className="p-0 text-muted">
              <TabPane tabId={mainTab}>
                <WithinBudget
                  within={!(budgetUnderflow && !budgetOverflow)}
                  columns={columns}
                  data={
                    mainTab === 0
                      ? applicants.slice(0, separator)
                      : applicants.slice(separator, applicants.length)
                  }
                />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

Applicants.propTypes = {
  t: PropTypes.any,
};

export default withRouter(
  withTranslation()(
    connect((state) => {
      return {
        TFMS: state.TFMS,
        Applicants: state.Applicants,
        Features: state.Features,
      };
    })(Applicants)
  )
);
