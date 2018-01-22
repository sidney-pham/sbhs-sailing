import React from 'react';
import moment from 'moment';
import queryAPI from '../../utilities/request';
import styles from './style.css';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.roster,
      deleted: false
    };
    this.delete = this.delete.bind(this);
  }

  async delete() {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const query = `
      mutation ($eventID: ID!) {
        deleteEvent(eventID: $eventID)
      }
      `;
      const variables = {
        eventID: this.state.id
      };
      const rosterToDeleteID = await queryAPI(query, variables).then(data => data.data.deleteEvent);
      if (rosterToDeleteID) {
        this.setState({ deleted: true });
      }
    }
  }

  render() {
    const roster = this.state;
    const { user } = this.props;
    let date = `Date: ${moment(roster.startDate).format('MMMM Do, YYYY')}`;
    if (roster.endDate) {
      date += ` to ${moment(roster.endDate).format('MMMM Do, YYYY')}`;
    }
    const tableBody = roster.boats.map(boat => (
      <tr key={boat.id}>
        <td>{boat.skipper}</td>
        <td>{boat.crew}</td>
        <td>{boat.boat}</td>
        <td>{boat.sailNumber}</td>
      </tr>
    ));

    return roster.deleted ? null : (
      <li>
        <article className={styles.roster}>
          <h3 className={styles.eventName}>{roster.eventName}</h3>
          <h4 className={styles.date}>{date}</h4>
          <h4 className={styles.location}>Location: {roster.location}</h4>
          <p>{roster.details}</p>
          <table className={styles.boatsTable}>
            <thead>
              <tr>
                <th>Skipper</th>
                <th>Crew</th>
                <th>Boat</th>
                <th>Sail Number</th>
              </tr>
            </thead>
            <tbody>
              {tableBody}
            </tbody>
          </table>
          {user.userLevel === 'admin' &&
            <ul className={styles.actionsBar}>
              <li>
                <button type="button" title="Delete" onClick={this.delete}>
                  <i className="fa fa-trash"></i>
                  Delete
                </button>
              </li>
            </ul>
          }
        </article>
      </li>
    );
  }
}
