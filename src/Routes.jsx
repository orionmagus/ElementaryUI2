import React from "react";
import { Route, NavLink, Switch } from "react-router-dom";
import posed from "react-pose";

const RouteContainer = posed.div({
  enter: { opacity: 1, delay: 300, beforeChildren: true },
  exit: { opacity: 0 }
});

const Link = NavLink,
  ContentRoute = props => (
    <div>
      <div>
        <SideBarNav />
      </div>
      <Route
        render={props => {
          <RouteContainer key={props.location.key}>
            <Switch location={props.location}>
              <Route exact path="/" component={Content} key="home" />
              <Route path="/icons" component={Load} key="about" />
            </Switch>
          </RouteContainer>;
        }}
      />
    </div>
  ),
  SideBarNav = props => (
    <nav>
      <NavLink to="/">Page Grid</NavLink>
      <Link to="/icons">Icons</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/show_case">Show Case</Link>
    </nav>
  );
