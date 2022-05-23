import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Alert, CardBody, Button } from "reactstrap";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar-1.jpg";

const UserProfile = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setIdx] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const user = JSON.parse(localStorage.getItem("authUser"));
      console.log(user);
      if (process.env.REACT_APP_DEFAULTAUTH === "cognito") {
        setName(user.username.charAt(0).toUpperCase() + user.username.slice(1));
        setEmail(user.email);
        setIdx(user.phone_number);
      } else if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        setName(user.displayName);
        setEmail(user.email);
        setIdx(user.uid);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        setName(user.username);
        setEmail(user.email);
        setIdx(user.uid);
      }
    }
  }, [props.success]);

  return (
    <div className="page-content">
      {/* Render Breadcrumb */}
      <Breadcrumb title="User" breadcrumbItem="Profile" />

      <Row>
        <Col lg="12">
          {props.error && props.error ? (
            <Alert color="danger">{props.error}</Alert>
          ) : null}
          {props.success && props.success ? (
            <Alert color="success">{props.success}</Alert>
          ) : null}

          <Card>
            <CardBody>
              <div className="d-flex table-responsive">
                <div className=" p-3">
                  <img
                    src={avatar}
                    alt=""
                    className="avatar-md rounded-circle"
                  />
                </div>
                <div className="flex-1 align-self-center">
                  <div className="text-muted">
                    <h5>{name}</h5>
                    <p className="mb-1">{email}</p>
                    <p className="mb-0">{phone}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* <Card>
        <h4 className="card-title mb-4">Change User Name</h4>
          <CardBody>
            <AvForm
              className="form-horizontal"
              onValidSubmit={(e, v) => {
                handleValidSubmit(e, v);
              }}
            >
              <div className="form-group">
                <AvField
                  name="username"
                  label="User Name"
                  value={name}
                  className="form-control"
                  placeholder="Enter User Name"
                  type="text"
                  required
                />
                <AvField name="idx" value={phone} type="hidden" />
              </div>
              <div className="text-center mt-4">
                <Button type="submit" color="danger">
                  Edit User Name
                </Button>
              </div>
            </AvForm>
          </CardBody>
        </Card> */}
    </div>
  );
};

export default UserProfile;
