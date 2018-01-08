import React from 'react';
import NewPost from '../new-post';
import LatestNews from '../latest-news';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.setTitle('Home');
  }

  render() {
    const { user } = this.props;
    return (
      <main>
        <NewPost />
        <LatestNews user={user} />
      </main>
    );
  }
}
