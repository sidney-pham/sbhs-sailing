import React from 'react';
import classNames from 'classnames';
import Posts from '../posts';
import styles from './style.css';

export default class RostersSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.changeSort = this.changeSort.bind(this);
  }

  changeSort(event) {
    window.localStorage.setItem('rosterSort', event.target.value);
    // this.props.refreshPosts(event.target.value);
  }

  render() {
    const {
      user,
      newRosterOpen,
      toggleNewRosterOpen,
      sort
    } = this.props;
    return (
      <section>
        <div className={styles.topBar}>
          <h2 className={styles.title}>Rosters/Events</h2>
          <label className={styles.sortLabel}>Sort By:
            <select value={sort} onChange={this.changeSort}>
              <option value="new">Date (earliest - latest)</option>
              <option value="old">Date (latest - earliest)</option>
            </select>
          </label>
          {!newRosterOpen &&
            <button type="button" onClick={toggleNewRosterOpen} className={classNames('smallButton', styles.newRosterButton)}>
              <i className="fa fa-plus" aria-hidden="true"></i>New Roster
            </button>
          }
        </div>
        {/* <Posts user={user} posts={posts} refreshPosts={refreshPosts}/> */}
      </section>
    );
  }
}
