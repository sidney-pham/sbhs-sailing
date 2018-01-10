import React from 'react';
import Post from '../post';
import queryAPI from '../../utilities/request';
import styles from './style.css';

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null
    };
    this.getPosts = this.getPosts.bind(this);
  }

  // TODO: Make into single API call. On second thought, is this really a good idea?
  componentWillMount() {
    this.getPosts();
  }

  async getPosts() {
    const query = `
    query {
      newsfeed {
        id
        author {
          firstName
          surname
        }
        title
        content
        createdAt
        likes
        pinned
        likedByUser
      }
    }
    `;
    const posts = await queryAPI(query).then(data => data.data.newsfeed);
    this.setState({ posts });
  }

  render() {
    const { posts } = this.state;
    if (!posts) {
      return <p>Loading posts...</p>;
    }
    console.log(posts);
    return (
      <ul className={styles.postsList}>
        {posts.map(post => <Post key={post.id} post={post} user={this.props.user} />)}
      </ul>
    )
  }
}
