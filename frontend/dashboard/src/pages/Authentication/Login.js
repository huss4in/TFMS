// React
import React, { useEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

// i18n
import { withTranslation } from "react-i18next";

// Components
import { Row, Col, Alert, Container } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

// Actions
import { loginUser, apiError } from "../../store/auth/login/actions";

// Images
import logo from "../../assets/images/tamkeen/favicon.ico";
import logoEn from "../../assets/images/tamkeen/tamkeen-logo-en.gif";
import logoAr from "../../assets/images/tamkeen/tamkeen-logo-ar.gif";

const Login = (props) => {
  useEffect(() => {
    document.body.className = "authentication-bg";
    return () => (document.body.className = "");
  });

  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    props.loginUser(values, props.history);
  };
  // handleValidSubmit
  const handleInvalidSubmit = (event, values) => {
    props.apiError(values);
    console.log("Invalid Form", event, values);
  };

  return (
    <div className="account-pages my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="card overflow-hidden">
              <div className="bg-login-bg">
                <div className="bg-login text-center">
                  <div className="bg-login-overlay"></div>
                  <div className="position-relative" style={{ marginTop: 22 }}>
                    <h5 className="text-white font-size-20">
                      {props.t("Welcome Back!")}
                    </h5>
                    <p className="text-white-50 mb-0">
                      {props.t("Sign in to continue to TFMS")}
                    </p>
                    <Link to="/" className="logo mt-4">
                      <img
                        src={props.t("Arabic") == "العربية" ? logoAr : logoEn}
                        alt=""
                        height={60}
                        style={{ marginTop: 40 }}
                      />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card-body pt-5">
                <div className="p-2">
                  <AvForm
                    className="form-horizontal"
                    onValidSubmit={(e, v) => handleValidSubmit(e, v)}
                    onInvalidSubmit={(e, v) => handleInvalidSubmit(e, v)}
                  >
                    {props.error && typeof props.error === "string" ? (
                      <Alert color="danger">{props.error}</Alert>
                    ) : null}

                    <div className="mb-3">
                      <AvField
                        name="email"
                        label={props.t("Username")}
                        className="form-control"
                        placeholder={props.t("Enter Username")}
                        type="name"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <AvField
                        name="password"
                        label={props.t("Password")}
                        type="password"
                        placeholder={props.t("Enter Password")}
                        required
                      />
                    </div>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="customControlInline"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="customControlInline"
                      >
                        {props.t("Remember me")}
                      </label>
                    </div>

                    <div className="mt-3">
                      <button
                        className="btn btn-primary w-100 waves-effect waves-light"
                        type="submit"
                      >
                        {props.t("Log In")}
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      <Link to="/forgot-password" className="text-muted">
                        <i className="mdi mdi-lock me-1"></i>
                        {props.t("Forgot your password?")}
                      </Link>
                    </div>
                  </AvForm>
                </div>
              </div>
            </div>
            <div className="mt-5 text-center">
              <p>
                © {new Date().getFullYear()} Tamkeen.{" "}
                {props.t("All rights reserved.")}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({ error: state.Login.error });

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
  apiError: PropTypes.func,
  t: PropTypes.any,
};

export default withRouter(
  withTranslation()(connect(mapStateToProps, { loginUser, apiError })(Login))
);
