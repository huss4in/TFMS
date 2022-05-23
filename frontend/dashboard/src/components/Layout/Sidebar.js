// React
import React from "react";
import PropTypes from "prop-types";

// Redux
import { withRouter } from "react-router-dom";

// i18n
import { withTranslation } from "react-i18next";

// Components
import SidebarContent from "./SidebarContent";

const Sidebar = (props) => {
  return (
    <div className="vertical-menu">
      <div className="h-100">
        <div className="user-wid text-center py-4"></div>
        <div data-simplebar className="h-100">
          <SidebarContent />
        </div>
      </div>
    </div>
  );
};

export default withRouter(withTranslation()(Sidebar));
