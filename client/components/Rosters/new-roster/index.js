import React from 'react';
import classNames from 'classnames';
import ResizingTextarea from '../../resizing-textarea';
import BoatsInput from '../boats-input';
import queryAPI from '../../../utilities/request';
import styles from './style.css';

export default class NewRoster extends React.Component {
  constructor(props) {
    super(props);
    this.maxBoats = 20;
    this.state = {
      eventName: '',
      startDate: '',
      endDate: '',
      location: '',
      details: '',
      boats: [
        {
          row: 0,
          skipper: '',
          crew: '',
          boat: '',
          sailNumber: ''
        }
      ]
    };
    this.confirmBeforeClosing = this.confirmBeforeClosing.bind(this);
    this.addRoster = this.addRoster.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBoats = this.handleBoats.bind(this);
    this.changeNumberOfBoats = this.changeNumberOfBoats.bind(this);
  }

  confirmBeforeClosing(event) {
    const someContent = this.state.title || this.state.content;
    const close = someContent
      ? window.confirm('You will lose your new roster, are you sure you want to close?')
      : true;
    if (close) {
      this.props.toggleNewRosterOpen(event);
    }
  }

  async addRoster(event) {
    event.preventDefault();

    const query = `
    mutation ($event: EventInput!) {
      addEvent(event: $event) {
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
        }
      }
    }
    `;

    // Don't use row field in this.state.boats.
    const boats = this.state.boats.map(boat => {
      console.log(boat);
      const { row, ...newBoat } = boat;
      return newBoat;
    });
    console.log(boats);
    const variables = {
      event: {
        eventName: this.state.eventName,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        location: this.state.location,
        details: this.state.details,
        boats
      }
    };
    const submitted = await queryAPI(query, variables).then(data => data.data.addEvent.id);
    if (submitted) {
      this.setState({
        eventName: '',
        startDate: '',
        endDate: '',
        location: '',
        details: '',
        boats: [
          {
            row: 0,
            skipper: '',
            crew: '',
            boat: '',
            sailNumber: ''
          }
        ]
      });
      this.props.refreshRosters();
      this.props.toggleNewRosterOpen();
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleBoats(rowIndex, newBoat) {
    this.setState(prevState => {
      const newBoats = prevState.boats;
      newBoats[rowIndex] = newBoat;
      return {
        boats: newBoats
      };
    });
  }

  changeNumberOfBoats(event) {
    const input = event.target;
    let numBoats = input.value || 0;

    // TODO: Double check all setStates don't reference this.state or this.props;
    this.setState(prevState => {
      // Add more boats.
      if (numBoats > prevState.boats.length) {
        // Make sure very large user-typed numbers aren't valid.
        numBoats = Math.min(this.maxBoats, numBoats);

        // Add empty boats until boats contains numBoats boats.
        const newBoats = [];
        for (let i = prevState.boats.length; i < numBoats; i++) {
          newBoats.push({
            row: i,
            skipper: '',
            crew: '',
            boat: '',
            sailNumber: ''
          });
        }

        return {
          boats: [...prevState.boats, ...newBoats]
        };
      } else {
        // Only let the user remove empty rows of boats.
        // Find the bottom-most row of boats that isn't empty.
        let lastFilledInRow = 0;
        for (let [rowIndex, row] of [...prevState.boats].reverse().entries()) {
          rowIndex = prevState.boats.length - rowIndex;
          if (row.skipper !== '' || row.crew !== '' || row.boat !== '' || row.sailNumber !== '') {
            lastFilledInRow = rowIndex;
            break;
          }
        }

        return {
          // Return 0 or more rows of boats.
          boats: prevState.boats.slice(0, Math.max(0, lastFilledInRow, numBoats))
        };
      }
    });
  }

  render() {
    return (
      <section className={styles.newRoster}>
        <form onSubmit={this.addRoster}>
          <div className={styles.topBar}>
            <h2 className={styles.title}>New Roster</h2>
            {this.props.newRosterOpen &&
              <button type="button" className={classNames('smallButton', styles.closeButton)} onClick={this.confirmBeforeClosing}>
                <i className="fa fa-close" aria-hidden="true"></i>Close
              </button>
            }
          </div>
          <div>
            <label>
              Event Name
              <input
                className={styles.input}
                onChange={this.handleChange}
                type="text"
                name="eventName"
                value={this.state.eventName}
                placeholder="Required"
                maxLength="100"
                required
              />
            </label>
            <label>
              Start Date
              <input
                className={styles.input}
                onChange={this.handleChange}
                type="date"
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                name="startDate"
                value={this.state.startDate}
                placeholder="Required (yyyy-mm-dd)"
                maxLength="100"
                required
              />
            </label>
            <label>
              End Date
              <input
                className={styles.input}
                onChange={this.handleChange}
                type="date"
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                name="endDate"
                value={this.state.endDate}
                placeholder="(yyyy-mm-dd)"
                maxLength="100"
              />
            </label>
            <label>
              Location
              <input
                className={styles.input}
                onChange={this.handleChange}
                type="text"
                name="location"
                value={this.state.location}
                placeholder="Required"
                maxLength="100"
                required
              />
            </label>
            <label>
              Details
              <ResizingTextarea
                className={styles.textarea}
                onChange={this.handleChange}
                name="details"
                value={this.state.details}
                maxLength="10000"
              />
            </label>
            <label>
              Number of boats
              <input
                className={styles.input}
                onChange={this.changeNumberOfBoats}
                type="number"
                name="numberOfBoats"
                value={this.state.boats.length === 0 ? '' : this.state.boats.length}
                placeholder="Required"
                min="1"
                max={this.maxBoats.toString()}
                required
              />
            </label>
            <BoatsInput
              handleBoats={this.handleBoats}
              boats={this.state.boats}
            />
            <button type="submit" className={classNames('smallButton', styles.submitButton)}>
              <i className="fa fa-check" aria-hidden="true"></i>Submit
            </button>
          </div>
        </form>
      </section>
    );
  }
}
