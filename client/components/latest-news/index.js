import React from 'react';
import classNames from 'classnames';
import Posts from '../posts';
import styles from './style.css';

export default class LatestNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.changeSort = this.changeSort.bind(this);
  }

  changeSort(event) {
    window.localStorage.setItem('postSort', event.target.value);
    this.props.refreshPosts(event.target.value);
  }

  render() {
    const {
      newPostOpen,
      toggleNewPostOpen,
      refreshPosts,
      sort,
      user,
      posts
    } = this.props;
    return (
      <section>
        <div className={styles.topBar}>
          <h2 className={styles.title}>Latest News</h2>
          <label className={styles.sortLabel}>Sort By:
            <select value={sort} onChange={this.changeSort}>
              <option value="new">New</option>
              <option value="old">Old</option>
              <option value="top">Top</option>
            </select>
          </label>
          {!newPostOpen &&
            <button type="button" onClick={toggleNewPostOpen} className={classNames('smallButton', styles.newPostButton)}>
              <i className="fa fa-plus" aria-hidden="true"></i>New Post
            </button>
          }
        </div>
        <Posts user={user} posts={posts} refreshPosts={refreshPosts}/>
      </section>
    );
  }
}
