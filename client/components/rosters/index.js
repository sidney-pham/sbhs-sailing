import React from 'react';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.setTitle('Rosters');
  }

  render() {
    return (
      <main>
        <h2>Rosters!</h2>
      </main>
    );
  }
}