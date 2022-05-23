// React
import React, { useState } from "react";
import PropTypes from "prop-types";

import { Form, Input, Button, Container } from "reactstrap";
import { Link } from "react-router-dom";

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

// Import menuDropdown
import LanguageDropdown from "../Common/TopbarDropdown/LanguageDropdown";
import ProfileMenu from "../Common/TopbarDropdown/ProfileMenu";

// Logos
import logoEn from "../../assets/images/tamkeen/tamkeen-logo-en.gif";
import logoAr from "../../assets/images/tamkeen/tamkeen-logo-ar.gif";

// i18n
import { withTranslation } from "react-i18next";

const Header = (props) => {
  const [search, setSearch] = useState(false);

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen)
        document.documentElement.requestFullscreen();
      else if (document.documentElement.mozRequestFullScreen)
        document.documentElement.mozRequestFullScreen();
      else if (document.documentElement.webkitRequestFullscreen)
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
    } else {
      if (document.cancelFullScreen) document.cancelFullScreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen)
        document.webkitCancelFullScreen();
    }
  }

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <Container fluid>
          <div className="float-end">
            <Dropdown
              className="d-inline-block d-lg-none ms-2"
              onClick={() => {
                setSearch(!search);
              }}
              type="button"
            >
              <DropdownToggle
                className="btn header-item noti-icon waves-effect"
                id="page-header-search-dropdown"
                tag="button"
              ></DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                <Form className="p-3">
                  <div className="m-0">
                    <div className="input-group">
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <Button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </DropdownMenu>
            </Dropdown>
            <LanguageDropdown />
            <Dropdown className="d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="btn header-item noti-icon waves-effect"
                data-toggle="fullscreen"
              >
                <i className="mdi mdi-fullscreen"></i>
              </button>
            </Dropdown>
            <ProfileMenu />
          </div>
          <div>
            <div className="navbar-brand-box">
              <Link to="/" className="logo">
                <span className="logo-lg">
                  <img
                    src={props.t("Arabic") == "العربية" ? logoAr : logoEn}
                    alt="Tamkeen"
                    height="40"
                  />
                </span>
                <span className="logo-sm">
                  <img
                    src={props.t("Arabic") == "العربية" ? logoAr : logoEn}
                    alt="Tamkeen"
                    height="30"
                  />
                </span>
              </Link>
            </div>
            <button
              type="button"
              className="btn btn-sm px-3 font-size-16 d-lg-none header-item waves-effect waves-light"
              data-toggle="collapse"
              onClick={() => {
                if (window.screen.width <= 0)
                  document.body.classList.toggle("sidebar-enable");
                else {
                  document.body.classList.toggle("vertical-collpsed");
                  document.body.classList.toggle("sidebar-enable");
                }
              }}
              data-target="#topnav-menu-content"
            >
              <i className="fa fa-fw fa-bars"></i>
            </button>
          </div>
        </Container>
      </div>
    </header>
  );
};

Header.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Header);
