// React
import React, { useEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// Actions
import { logoutUser } from "../../store/auth/login/actions";

const Logout = (props) => {
  useEffect(() => {
    props.logoutUser(props.history);
  });

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
  logoutUser: PropTypes.func,
};

export default withRouter(connect(null, { logoutUser })(Logout));
