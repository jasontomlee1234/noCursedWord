import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from '../src/components/home/index'
import OpenBox from '../src/components/box-show/index'
import EggBag from '../src/components/egg-show/index'
import './App.css'


export default function BasicExample() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/OpenBox">
          <OpenBox />
        </Route>
        <Route path="/EggBag">
          <EggBag />
        </Route>
      </Switch>
    </Router>
  );
}
