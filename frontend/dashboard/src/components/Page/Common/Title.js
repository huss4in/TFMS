// React
import React from "react";
import PropTypes from "prop-types";

// Components
import { Link } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";

const Title = (props) => {
  return (
    <Row>
      <Col className="col-12">
        <div className="page-title-box d-flex align-items-start align-items-center justify-content-between">
          <h4 className="page-title mb-0 font-size-18">{props.title}</h4>

          {props.subtitle && (
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <BreadcrumbItem active={false}>
                  <Link to="/wizard">{props.title}</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active={true}>
                  <Link to="">{props.subtitle}</Link>
                </BreadcrumbItem>
              </ol>
            </div>
          )}

          {!props.subtitle && props.comment && (
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item active">{props.comment}</li>
              </ol>
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

Title.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default Title;
