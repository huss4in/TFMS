// React
import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// Router
import { BrowserRouter, Switch } from "react-router-dom";

// Auth
import { initFirebaseBackend } from "./helpers/firebase_helper";
import { initCognitoBackend } from "./helpers/cognito_helper";

// Routes
import { authRoutes, nonAuthRoutes } from "./routes/allRoutes";

// Middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";

// Layout
import { AuthLayout, NonAuthLayout } from "./components/Layout";

// SCSS
import "./assets/scss/theme.scss";

// // Initialize Authentication
// initFirebaseBackend({
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
// });

// Initialize Authentication
initCognitoBackend({
  UserPoolId: process.env.REACT_APP_USERPOOL_ID,
  ClientId: process.env.REACT_APP_CLIENT_ID,
});

const App = () => (
  <BrowserRouter>
    <Switch>
      {nonAuthRoutes.map((route, i) => (
        <Authmiddleware
          key={i}
          path={route.path}
          layout={NonAuthLayout}
          component={route.component}
          isAuthProtected={false}
        />
      ))}

      {authRoutes.map((route, i) => (
        <Authmiddleware
          key={i}
          path={route.path}
          layout={AuthLayout}
          component={route.component}
          isAuthProtected={true}
        />
      ))}
    </Switch>
  </BrowserRouter>
);

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state) => ({
  layout: state.Layout,
});

export default connect(mapStateToProps, null)(App);
