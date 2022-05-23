// React
import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// Actions
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
} from "../../store/layout/actions";

import { ACTION as PROGRAMS } from "../../store/tfms/programs";
import { ACTION as RUNS } from "../../store/tfms/runs";

// Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobile: /android|iphone/i.test(navigator.userAgent),
    };
  }

  capitalizeFirstLetter = (string) =>
    string.charAt(1).toUpperCase() + string.slice(2);

  componentDidMount() {
    if (!this.props.Programs.programs.length) this.props.fetchPrograms();
    if (this.props.Runs.runs !== null && !this.props.Runs.runs.length)
      this.props.fetchRuns();

    if (this.props.isPreloader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(() => {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }

    window.scrollTo(0, 0);

    document.title = this.capitalizeFirstLetter(this.props.location.pathname);

    if (this.props.leftSideBarTheme)
      this.props.changeSidebarTheme(this.props.leftSideBarTheme);

    this.props.changeLayout("detached");

    if (this.props.layoutWidth)
      this.props.changeLayoutWidth(this.props.layoutWidth);

    if (this.props.leftSideBarType)
      this.props.changeSidebarType(this.props.leftSideBarType);

    if (this.props.topbarTheme)
      this.props.changeTopbarTheme(this.props.topbarTheme);
  }

  render = () => (
    <>
      <div id="preloader">
        <div id="status">
          <div className="spinner-chase">
            <div className="chase-dot"></div>
            <div className="chase-dot"></div>
            <div className="chase-dot"></div>
            <div className="chase-dot"></div>
            <div className="chase-dot"></div>
            <div className="chase-dot"></div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div id="layout-wrapper">
          <Header />
          <Sidebar
            theme={this.props.leftSideBarTheme}
            type={this.props.leftSideBarType}
            isMobile={this.state.isMobile}
          />
          <div className="main-content">
            {this.props.children}
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

const { fetchPrograms } = PROGRAMS;
const { fetchRuns } = RUNS;

export const AuthLayout = connect(
  (state) => ({
    ...state.Layout,
    Programs: state.Programs,
    Runs: state.Runs,
  }),
  {
    fetchPrograms,
    fetchRuns,
    changeLayout,
    changeSidebarTheme,
    changeSidebarType,
    changeTopbarTheme,
    changeLayoutWidth,
  }
)(withRouter(Layout));
