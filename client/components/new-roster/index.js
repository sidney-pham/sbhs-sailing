import React from 'react';
import classNames from 'classnames';
import ResizingTextarea from '../resizing-textarea';
import BoatsInput from '../boats-input';
import queryAPI from '../../utilities/request';
import styles from './style.css';

export default class NewRoster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: '',
      startDate: '',
      endDate: '',
      location: '',
      details: '',
      boats: []
    };
    this.confirmBeforeClosing = this.confirmBeforeClosing.bind(this);
    this.addRoster = this.addRoster.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBoats = this.handleBoats.bind(this);
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
    mutation ($title: String!, $content: String!) {
      addPost(title: $title, content: $content) {
        id
      }
    }
    `;
    const variables = {
      title: this.state.title,
      content: this.state.content
    };
    const submitted = await queryAPI(query, variables).then(data => data.data.addPost.id);
    if (submitted) {
      this.setState({
        title: '',
        content: ''
      });
      this.props.refreshPosts();
      this.props.toggleNewPostOpen();
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleBoats(event) {
    this.setState({ boats: [] });
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
                required
              />
            </label>
            <BoatsInput handleBoats={this.handleBoats} />
            <button type="submit" className={classNames('smallButton', styles.submitButton)}>
              <i className="fa fa-check" aria-hidden="true"></i>Submit
            </button>
          </div>
        </form>
      </section>
    );
  }
}
