import React from 'react';
import Post from '../post';
import styles from './style.css';

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { posts } = this.props;
    if (!posts) {
      return <p>Loading posts...</p>;
    }

    if (posts.length === 0) {
      return <p>No posts yet!</p>;
    }

    // Float pinned posts up to the top.
    posts.sort((a, b) => {
      if ((a.pinned && b.pinned) || (!a.pinned && !b.pinned)) {
        return 1;
      } else {
        return a.pinned ? -1 : 1;
      }
    });

    return (
      <ul className={styles.postsList}>
        {posts.map(post => (
          <Post
            key={post.id}
            post={post}
            user={this.props.user}
            refreshPosts={this.props.refreshPosts}
          />
        ))}
      </ul>
    )
  }
}
