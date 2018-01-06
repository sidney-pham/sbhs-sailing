import React from 'react';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // TODO: Better titling...
  componentWillMount() {
    document.title = 'Home';
  }

  render() {
    return (
      <div>
        <h2>Home!</h2>
      </div>
    );
  }
}
