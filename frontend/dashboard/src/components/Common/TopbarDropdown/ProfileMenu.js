import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

// users
import userImage from "../../../assets/images/users/avatar-1.jpg";

const ProfileMenu = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "cognito") {
        const user = JSON.parse(localStorage.getItem("authUser"));
        setUsername(user.username);
      } else if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setUsername(obj.displayName);
      }
    }
  }, [props.success]);

  return (
    <Dropdown
      isOpen={menu}
      toggle={() => setMenu(!menu)}
      className="d-inline-block"
    >
      <DropdownToggle
        className="btn header-item waves-effect"
        id="page-header-user-dropdown"
        tag="button"
      >
        <img
          className="rounded-circle header-profile-user"
          src={userImage}
          alt="Header Avatar"
        />
        <span
          className="d-none d-xl-inline-block ms-1"
          style={{
            textTransform: "capitalize",
          }}
        >
          {username}
        </span>
        <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <Link to="/profile">
          <DropdownItem>
            <i className="bx bx-user font-size-16 align-middle me-1"></i>
            {props.t("View Profile")}
          </DropdownItem>
        </Link>
        <DropdownItem href="/lock">
          <i className="bx bx-lock-open font-size-16 align-middle me-1"></i>
          {props.t("Lock screen")}
        </DropdownItem>
        <div className="dropdown-divider" />
        <Link to="/logout" className="dropdown-item text-danger">
          <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i>
          <span>{props.t("Logout")}</span>
        </Link>
      </DropdownMenu>
    </Dropdown>
  );
};

ProfileMenu.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(ProfileMenu);
