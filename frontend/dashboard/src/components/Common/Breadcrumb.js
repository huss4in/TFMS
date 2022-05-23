// React
import React from "react";
import PropTypes from "prop-types";

// Components
import { Link } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";

const Breadcrumb = (props) => {
  const { title, breadcrumbItem } = props;

  return (
    <Row>
      <Col className="col-12">
        <div className="page-title-box d-flex align-items-start align-items-center justify-content-between">
          <h4 className="page-title mb-0 font-size-18">
            {props.breadcrumbItem}
          </h4>

          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <BreadcrumbItem>
                <Link to="#">{title}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>
                <Link to="#">{breadcrumbItem}</Link>
              </BreadcrumbItem>
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
};

Breadcrumb.propTypes = {
  title: PropTypes.string,
  breadcrumbItem: PropTypes.string,
};

export default Breadcrumb;
