import React from 'react';
import { Route } from 'react-router-dom';
import Home from '../home';
import Rosters from '../rosters';
import Results from '../results';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <main>
        <Route exact path="/" component={Home} />
        <Route path="/rosters" component={Rosters} />
        <Route path="/results" component={Results} />
      </main>
    );
  }
}
