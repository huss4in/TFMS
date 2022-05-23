// React
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// i18n
import i18n from "../../../i18n";
import { withTranslation } from "react-i18next";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

import { get, map } from "lodash";

import usFlag from "../../../assets/images/flags/us.png";
import bhFlag from "../../../assets/images/flags/bh.png";
// import grFlag from "../../../assets/images/flags/gr.png";
// import spFlag from "../../../assets/images/flags/sp.png";
// import itFlag from "../../../assets/images/flags/it.png";

const languages = {
  en: {
    label: "English",
    flag: usFlag,
  },
  ar: {
    label: "Arabic",
    flag: bhFlag,
  },
  // gr: {
  //   label: "German",
  //   flag: grFlag,
  // },
  // sp: {
  //   label: "Spanish",
  //   flag: spFlag,
  // },
  // it: {
  //   label: "Italian",
  //   flag: itFlag,
  // },
};

const LanguageDropdown = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [selectedLang, setSelectedLang] = useState("");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setSelectedLang(localStorage.getItem("I18N_LANGUAGE"));
  }, []);

  const changeLanguageAction = (lang) => {
    //set language as i18n
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLang(lang);
  };

  const toggle = () => {
    setMenu(!menu);
  };

  return (
    <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
      <DropdownToggle className="btn header-item waves-effect" tag="button">
        <img
          src={get(languages, `${selectedLang}.flag`)}
          alt="Header Language"
          height="20"
        />
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end" end>
        {map(Object.keys(languages), (key) => (
          <DropdownItem
            key={key}
            onClick={() => changeLanguageAction(key)}
            className={`notify-item ${
              selectedLang === key ? "active" : "none"
            }`}
          >
            <img
              src={get(languages, `${key}.flag`)}
              alt="LNG"
              className="me-1"
              height="16"
            />
            <span className="align-middle" style={{ marginLeft: "10px" }}>
              {props.t(get(languages, `${key}.label`))}
            </span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

LanguageDropdown.prototype = {
  t: PropTypes.any,
};

export default withTranslation()(LanguageDropdown);
