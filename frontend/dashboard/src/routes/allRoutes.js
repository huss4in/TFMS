import React from "react";
import { Redirect } from "react-router-dom";

// Dashboard
import Dashboard from "../pages/Dashboards";

// Wizard
import Wizard from "../pages/Wizard";

// Maintenance
import PagesMaintenance from "../pages/Utility/maintenance";
import PagesComingSoon from "../pages/Utility/coming-soon";

// Errors
import Pages404 from "../pages/Utility/404";
import Pages500 from "../pages/Utility/500";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Lock from "../pages/Authentication/Lock";

// Profile
import UserProfile from "../pages/Authentication/Profile";

const nonAuthRoutes = [
  // Login
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
  { path: "/lock", component: Lock },

  // Maintenance
  { path: "/maintenance", component: PagesMaintenance },
  { path: "/coming-soon", component: PagesComingSoon },
  { path: "/404", component: Pages404 },
  { path: "/500", component: Pages500 },
];

const authRoutes = [
  // Dashboards
  { path: "/dashboard", component: Dashboard },

  // Wizard
  { path: "/wizard", component: Wizard },

  // Profile
  { path: "/profile", component: UserProfile },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

export { authRoutes, nonAuthRoutes };
