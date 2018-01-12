import React from 'react';
import queryAPI from '../../utilities/request';
import NewRoster from '../new-roster';
import RostersSection from '../rosters-section';

export default class Rosters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newRosterOpen: false,
      sort: window.localStorage.getItem('rosterSort') || 'new',
      rosters: null
    };
    this.toggleNewRosterOpen = this.toggleNewRosterOpen.bind(this);
    this.getRosters = this.getRosters.bind(this);
  }

  componentWillMount() {
    this.props.setTitle('Home');
    // this.getRosters(this.state.sort);
  }

  async getRosters(sort = this.state.sort) {
    const query = `
    query ($sort: String) {
      newsfeed(sort: $sort) {
        id
        author {
          firstName
          surname
        }
        title
        content
        markdownContent
        createdAt
        likes
        pinned
        likedByUser
      }
    }
    `;
    const variables = {
      sort
    };
    const posts = await queryAPI(query, variables).then(data => data.data.newsfeed);
    this.setState({ posts, sort });
  }

  toggleNewRosterOpen() {
    this.setState(prevState => ({
      newRosterOpen: !prevState.newRosterOpen
    }));
  }

  render() {
    // const { newPostOpen, sort, posts } = this.state;
    const { user } = this.props;
    const { newRosterOpen, sort } = this.state;
    return (
      <main>
        {this.state.newRosterOpen &&
          <NewRoster
            newRosterOpen={newRosterOpen}
            toggleNewRosterOpen={this.toggleNewRosterOpen}
          />
        }
        <RostersSection
          user={user}
          newRosterOpen={newRosterOpen}
          toggleNewRosterOpen={this.toggleNewRosterOpen}
          sort={sort}
        />
        {/* {this.state.newPostOpen &&
          <NewPost
            newPostOpen={newPostOpen}
            toggleNewPostOpen={this.toggleNewPostOpen}
            refreshPosts={this.getPosts}
          />
        }
        <LatestNews
          user={user}
          posts={posts}
          newPostOpen={newPostOpen}
          toggleNewPostOpen={this.toggleNewPostOpen}
          sort={sort}
          refreshPosts={this.getPosts}
        /> */}
      </main>
    );
  }
}
