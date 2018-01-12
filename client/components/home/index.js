import React from 'react';
import queryAPI from '../../utilities/request';
import NewPost from '../new-post';
import LatestNews from '../latest-news';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPostOpen: false,
      sort: window.localStorage.getItem('postSort') || 'new',
      posts: null
    };
    this.toggleNewPostOpen = this.toggleNewPostOpen.bind(this);
    this.getPosts = this.getPosts.bind(this);
  }

  componentWillMount() {
    this.props.setTitle('Home');
    this.getPosts(this.state.sort);
  }

  async getPosts(sort = this.state.sort) {
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

  toggleNewPostOpen() {
    this.setState(prevState => ({
      newPostOpen: !prevState.newPostOpen
    }));
  }

  render() {
    const { user } = this.props;
    const { newPostOpen, sort, posts } = this.state;
    return (
      <main>
        {this.state.newPostOpen &&
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
        />
      </main>
    );
  }
}
