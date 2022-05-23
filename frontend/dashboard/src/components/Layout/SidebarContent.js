import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback } from "react";

//Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

// i18n
import { withTranslation } from "react-i18next";

const SidebarContent = (props) => {
  const ref = useRef();

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }
    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;
      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag
        const parent3 = parent2.parentElement; // li tag
        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname;
    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname, activateParentDropdown]);
  useEffect(() => {
    ref.current.recalculate();
  }, []);

  const scrollElement = (item) => {
    if (item)
      if (item.offsetTop > window.innerHeight)
        ref.current.getScrollElement().scrollTop = item.offsetTop - 300;
  };

  return (
    <SimpleBar ref={ref} className="vertical-simplebar">
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {/* {props.location.pathname === "/profile" && (
            <>
              <li className="menu-title">{props.t("Profile")} </li>
              <li>
                <Link
                  to="/profile"
                  className=" waves-effect"
                  style={{
                    marginBottom: "30px",
                  }}
                >
                  <i className="fas fa-user-circle"></i>
                  <span>{props.t("Profile")}</span>
                </Link>
              </li>
            </>
          )} */}

          <li className="menu-title">{props.t("Main Menu")}</li>

          <li>
            <Link to="/dashboard" className=" waves-effect">
              <i className="bx bxs-dashboard"></i>
              <span>{props.t("Dashboard")}</span>
            </Link>
          </li>

          <li>
            <Link to="/wizard" className=" waves-effect">
              <i className="bx bxs-magic-wand"></i>
              <span>{props.t("Wizard")}</span>
            </Link>
          </li>

          {/* 
          <li
            className="menu-title"
            style={{
              marginTop: "100px",
            }}
          >
            {props.t("Dev")}
          </li>

          <li>
            <Link to="/#" className="waves-effect">
              <i className="bx bx-test-tube"></i>
              <span className="badge rounded-pill bg-info float-end">3</span>
              <span>{props.t("Tests")}</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/test1">1</Link>
              </li>
              <li>
                <Link to="/test2">2</Link>
              </li>
            </ul>
          </li> */}
        </ul>
      </div>
    </SimpleBar>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
