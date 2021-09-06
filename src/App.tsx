import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import GamePicker from "./Components/Pages/Games/GamePicker";
import Settings from "./Components/Pages/Settings";
import Tokens from "./Components/Pages/Tokens";
import Landing from "./Components/Landing";
import Register from "./Components/Auth/Register";

export const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact>
        <Landing />
      </Route>
      <Route path="/signup" exact>
        <Register />
      </Route>
      <Route path="/cardgames" exact>
        <GamePicker />
      </Route>
      <Route path="/tokens" exact>
        <Tokens />
      </Route>
      <Route path="/settings" exact>
        <Settings />
      </Route>
    </Switch>
  </BrowserRouter>
);
