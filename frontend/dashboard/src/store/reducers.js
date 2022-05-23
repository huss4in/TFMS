// Redux
import { combineReducers } from "redux";

// Authentication
import Login from "./auth/login/reducer";

// Layout
import Layout from "./layout/reducer";

// TFMS
import TFMS from "./tfms/reducer";
import Programs from "./tfms/programs";
import Estimation from "./tfms/estimation";
import Features from "./tfms/features";
import Applicants from "./tfms/applicants";
import Runs from "./tfms/runs";
import Run from "./tfms/run";

export default combineReducers({
  // Auth
  Login,

  // Layout
  Layout,

  // TFMS
  TFMS,
  Programs,
  Estimation,
  Features,
  Applicants,
  Runs,
  Run,
});
