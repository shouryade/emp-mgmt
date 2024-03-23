import React from "react";
import IndexPage from "./index";
import DashboardPage from "./dashboard";
import { Switch, Route, Router } from "../util/router.js";
import SignUpSide from "../components/SignUpSide.js";
import NotFoundPage from "./not-found.js";
import { AuthProvider } from "./../util/auth.js";
import { ThemeProvider } from "./../util/theme.js";

function App(props) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <>
            <Switch>
              <Route exact path="/" component={IndexPage} />
              <Route exact path="/dashboard" component={DashboardPage} />
              <Route exact path="/auth/signup" component={SignUpSide} />
              <Route exact path="/auth/:type" component={IndexPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
