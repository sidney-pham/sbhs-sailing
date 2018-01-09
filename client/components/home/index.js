import React from 'react';
import NewPost from '../new-post';
import LatestNews from '../latest-news';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPostOpen: false
    };
    this.toggleNewPostOpen = this.toggleNewPostOpen.bind(this);
  }

  componentWillMount() {
    this.props.setTitle('Home');
  }

  toggleNewPostOpen() {
    this.setState(prevState => ({
      newPostOpen: !prevState.newPostOpen
    }));
  }

  render() {
    const { user } = this.props;
    return (
      <main>
        {this.state.newPostOpen &&
          <NewPost
            newPostOpen={this.state.newPostOpen}
            toggleNewPostOpen={this.toggleNewPostOpen}
          />
        }
        <LatestNews
          user={user}
          newPostOpen={this.state.newPostOpen}
          toggleNewPostOpen={this.toggleNewPostOpen}
        />
      </main>
    );
  }
}
