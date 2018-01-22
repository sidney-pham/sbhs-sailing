import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home/home';
import Rosters from '../Rosters/rosters';
import Results from '../Results/results';
import './style.css';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={routeProps => (
            <Home
              {...routeProps}
              user={this.props.user}
              setTitle={this.props.setTitle}
            />
          )}
        />
        <Route
          path="/rosters"
          render={routeProps => (
            <Rosters
              {...routeProps}
              user={this.props.user}
              setTitle={this.props.setTitle}
            />
          )}
        />
        <Route
          path="/results"
          render={routeProps => (
            <Results
              {...routeProps}
              user={this.props.user}
              setTitle={this.props.setTitle}
            />
          )}
        />
      </Switch>
    );
  }
}
