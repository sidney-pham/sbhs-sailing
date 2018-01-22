import React from 'react';
import Roster from '../roster';
import styles from './style.css';


export default function RostersList(props) {
  const { rosters } = props;
  if (!rosters) {
    return <p>Loading rosters...</p>;
  }

  if (rosters.length === 0) {
    return <p>No rosters yet!</p>;
  }

  function shouldDisplay(roster) {
    if (!props.showPastEvents) {
      return new Date(roster.startDate) > new Date();
    }
    return true;
  }

  return (
    <ul className={styles.rostersList}>
      {rosters.map(roster => (!shouldDisplay(roster) ? null : (
        <Roster
          key={roster.id}
          roster={roster}
          user={props.user}
          refreshRosters={props.refreshRosters}
        />
      )))
      }
    </ul>
  );
}
