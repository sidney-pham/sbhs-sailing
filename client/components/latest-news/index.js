import React from 'react';
import Posts from '../posts';
import styles from './style.css';

export default class LatestNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: 'new',
      posts: null
    };
    this.setSort = this.setSort.bind(this);
  }

  setSort(event) {
    this.setState({
      sort: event.target.value
    });
  }

  render() {
    return (
      <section>
        <div className={styles.topBar}>
          <h2 className={styles.title}>Latest News</h2>
          <label className={styles.sortLabel}>Sort By:
            <select value={this.state.sort} onChange={this.setSort}>
              <option value="new">New</option>
              <option value="old">Old</option>
              <option value="top">Top</option>
            </select>
          </label>
          <button type="button"><i className="fa fa-plus" aria-hidden="true"></i>New Post</button>
        </div>
        {this.state.posts ? <Posts user={this.props.user} /> : <p>Loading posts...</p>}
      </section>
    );
  }
}
