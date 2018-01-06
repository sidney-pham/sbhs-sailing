import React from 'react';
import { Route } from 'react-router-dom';
import Home from '../home';
import Rosters from '../rosters';
import Results from '../results';
import './style.css';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <main>
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
      </main>
    );
  }
}
