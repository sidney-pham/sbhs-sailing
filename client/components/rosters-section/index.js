import React from 'react';
import classNames from 'classnames';
import RostersList from '../rosters-list';
import styles from './style.css';

export default class RostersSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.changeSort = this.changeSort.bind(this);
  }

  changeSort(event) {
    window.localStorage.setItem('rosterSort', event.target.value);
    this.props.refreshRosters(event.target.value);
  }

  render() {
    const {
      user,
      rosters,
      newRosterOpen,
      toggleNewRosterOpen,
      showPastEvents,
      togglePastEvents,
      sort,
      refreshRosters
    } = this.props;

    return (
      <section>
        <div className={styles.topBar}>
          <h2 className={styles.title}>Rosters/Events</h2>
          <label className={styles.sortLabel}>Sort By:
            <select value={sort} onChange={this.changeSort}>
              <option value="earliest">Date (earliest - latest)</option>
              <option value="latest">Date (latest - earliest)</option>
            </select>
          </label>
          <label className={styles.showPastEventsLabel}>
            Show past events:
            <input type="checkbox" checked={showPastEvents} onChange={togglePastEvents} />
          </label>
          {!newRosterOpen &&
            <button type="button" onClick={toggleNewRosterOpen} className={classNames('smallButton', styles.newRosterButton)}>
              <i className="fa fa-plus" aria-hidden="true"></i>New Roster
            </button>
          }
        </div>
        <RostersList
          user={user}
          rosters={rosters}
          refreshRosters={refreshRosters}
          showPastEvents={showPastEvents}
        />
      </section>
    );
  }
}
