// React
import React, { Component } from "react";
import PropTypes from "prop-types";

// Router
import { withRouter } from "react-router-dom";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.capitalizeFirstLetter.bind(this);
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  componentDidMount() {
    document.title = this.capitalizeFirstLetter(this.props.location.pathname);
  }
  render = () => <>{this.props.children}</>;
}

Layout.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object,
};

export const NonAuthLayout = withRouter(Layout);
