import React from 'react';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.setTitle('Results');
  }

  render() {
    return (
      <main>
        <h2>Results!</h2>
      </main>
    );
  }
}
