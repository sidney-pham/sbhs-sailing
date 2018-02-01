import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import queryAPI from '../../../utilities/request';
import styles from './style.css';

export default class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.result,
      deleted: false,
      editing: false,
      changed: false
    };
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.clearResults = this.clearResults.bind(this);
    this.changeRaceScores = this.changeRaceScores.bind(this);
    this.changeFinalScore = this.changeFinalScore.bind(this);
    // console.log(this.state);
  }

  async save(event) {
    event.preventDefault();
    const query = `
    mutation ($eventID: ID!, $result: ResultInput!) {
      updateResult(eventID: $eventID, result: $result) {
        id
        eventName
        startDate
        endDate
        location
        details
        boats {
          id
          boat
          skipper
          crew
          sailNumber
          raceResults
          overall
        }
      }
    }
    `;
    // Construct a BoatResultInput input type as specified by GraphQL schema.
    const boats = this.state.boats.map(boat => {
      const { id, raceResults, overall } = boat;
      const newBoat = { id, raceResults, overall };
      return newBoat;
    });
    const variables = {
      eventID: this.state.id,
      result: {
        boats
      }
    };
    const { updateResult } = await queryAPI(query, variables).then(data => data.data);
    this.setState({
      editing: false,
      ...updateResult
    });
  }

  async edit() {
    this.setState(prevState => {
      if (prevState.editing) {
        // Close
        if (!prevState.changed || (prevState.changed && window.confirm('Are you sure you want to lose your changes?'))) {
          return {
            editing: !prevState.editing,
            boats: prevState.oldBoats,
            changed: false
          };
        }
      } else {
        // Edit
        // Store original title and content to revert to if user doesn't want to save.
        return {
          editing: !prevState.editing,
          // Deep clone.
          oldBoats: JSON.parse(JSON.stringify(prevState.boats)),
          changed: false
        };
      }
    });
  }

  async clearResults() {
    if (window.confirm('Are you sure you want to clear the results for this event?')) {
      const query = `
      mutation ($eventID: ID!) {
        deleteResult(eventID: $eventID) {
          id
          eventName
          startDate
          endDate
          location
          details
          boats {
            id
            boat
            skipper
            crew
            sailNumber
            raceResults
            overall
          }
        }
      }
      `;
      const variables = {
        eventID: this.state.id
      };
      const { deleteResult } = await queryAPI(query, variables).then(data => data.data);
      this.setState({ ...deleteResult });
    }
  }

  changeRaceScores(id, event) {
    const { boats } = this.state;
    const boatIndex = boats.findIndex(boat => boat.id === id);
    const raceScores = event.target.value;
    const newRaceResults = raceScores.split(',').map(pos => parseInt(pos.trim(), 10) || null);
    boats[boatIndex].raceResults = newRaceResults;

    this.setState({ boats, changed: true });
  }

  changeFinalScore(id, event) {
    const { boats } = this.state;
    const boatIndex = boats.findIndex(boat => boat.id === id);
    const overall = parseInt(event.target.value.trim(), 10) || null;
    boats[boatIndex].overall = overall;

    this.setState({ boats, changed: true });
  }

  render() {
    const result = this.state;
    const { user } = this.props;
    let date = `Date: ${moment(result.startDate).format('MMMM Do, YYYY')}`;
    if (result.endDate) {
      date += ` to ${moment(result.endDate).format('MMMM Do, YYYY')}`;
    }

    const headerCols = [];
    const raceLengths = result.boats.map(boat => (boat.raceResults ? boat.raceResults.length : 0));
    for (let i = 1; i <= Math.max(...raceLengths); i++) {
      headerCols.push(<th key={i}>Race {i}</th>);
    }
    const tableHead = (
      <tr>
        <th>Skipper</th>
        <th>Crew</th>
        <th>Boat</th>
        <th>Sail Number</th>
        {headerCols}
        {result.boats.some(boat => boat.overall) &&
          <th>Overall</th>
        }
      </tr>
    );
    const tableBody = result.boats.map(boat => (
      <tr key={boat.id}>
        <td>{boat.skipper}</td>
        <td>{boat.crew}</td>
        <td>{boat.boat}</td>
        <td>{boat.sailNumber}</td>
        {boat.raceResults && boat.raceResults.map((position, index) => (
          <td key={index}>{position}</td>
        ))}
        {boat.raceResults &&
          /* Pad out rest of row until Overall. */
          (() => {
            const padding = [];
            for (let i = boat.raceResults.length; i < headerCols.length; i++) {
              padding.push(<td key={i}></td>);
            }
            return padding;
          })()
        }
        {boat.overall &&
          <td>{boat.overall}</td>
        }
      </tr>
    ));

    return result.deleted ? null : (
      <li>
        <article className={styles.result}>
          <form onSubmit={this.save}>
            <h3 className={styles.eventName}>{result.eventName}</h3>
            <h4 className={styles.date}>{date}</h4>
            <h4 className={styles.location}>Location: {result.location}</h4>
            <p>{result.details}</p>
            {!result.boats.some(boat => boat.raceResults) &&
              <h4 className={styles.resultsNotAvailable}>Results not yet available.</h4>
            }
            {this.state.editing && (
              <div className={styles.edit}>
                <h4 className={styles.editBoatsHeader}>Edit Boats</h4>
                <ul className={styles.editList}>
                  {result.boats.map(boat => (
                    <li key={boat.id}>
                      <label>
                        <div className={styles.editBoat}>
                          {boat.boat}
                        </div>
                        <input
                          type="text"
                          placeholder="Race scores (comma-separated)"
                          title="Comma separated integers, e.g., '1,3,,2,,,4'"
                          pattern="^[-\d\s]+(?:,[-\d\s]*)*$"
                          required
                          onChange={event => this.changeRaceScores(boat.id, event)}
                          className={styles.raceScores}
                        />
                        <input
                          type="number"
                          placeholder="Overall score"
                          pattern="^\d+$"
                          required
                          onChange={event => this.changeFinalScore(boat.id, event)}
                          className={styles.overall}
                        />
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <table className={styles.boatsTable}>
              <thead>
                {tableHead}
              </thead>
              <tbody>
                {tableBody}
              </tbody>
            </table>
            {user.userLevel === 'admin' &&
              <ul className={styles.actionsBar}>
                {this.state.editing &&
                  <li>
                    <button type="submit" title="Save">
                      <i className="fa fa-save"></i>
                      Save
                    </button>
                  </li>
                }
                <li>
                  <button type="button" title="Edit" onClick={this.edit}>
                    <i className={classNames('fa', this.state.editing ? 'fa-close' : 'fa-pencil')}></i>
                    {this.state.editing ? 'Close' : 'Edit'}
                  </button>
                </li>
                <li>
                  <button type="button" title="Clear Results" onClick={this.clearResults}>
                    <i className="fa fa-close"></i>
                    Clear Results
                  </button>
                </li>
              </ul>
            }
          </form>
        </article>
      </li>
    );
  }
}
