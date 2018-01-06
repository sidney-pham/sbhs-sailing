import React from 'react';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // TODO: Better titling...
  componentWillMount() {
    console.log('home!');
    console.log(this.props);
    this.props.setTitle('Home');
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        <h2>Home!</h2>
        <p>Email: {user ? user.email : 'No email yet...'}</p>
        <p>Student ID: {user ? user.studentID : 'No student ID yet...'}</p>
      </div>
    );
  }
}
