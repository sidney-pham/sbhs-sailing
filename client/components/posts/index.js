import React from 'react';
import Post from '../post';
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
          name
        }
        title
        content
      }
    }
    `;
    const posts = await fetch('/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    }).then(res => res.json()).then(data => data.data.newsfeed);
    this.setState({ posts });
  }

  render() {
    const { posts } = this.state;
    if (!posts) {
      return <p>Loading posts...</p>;
    }
    return (
      <ul className={styles.postsList}>
        {posts.map(post => <Post key={post.id} post={post} />)}
      </ul>
    )
  }
}
