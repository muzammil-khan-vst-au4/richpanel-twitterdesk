import React from "react";
import HomePage from "./components/Homepage";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/search" exact>
          <h1>DAshboard</h1>
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
