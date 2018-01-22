import React from 'react';
import queryAPI from '../../utilities/request';
import NewRoster from '../new-roster';
import RostersSection from '../rosters-section';

export default class Rosters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newRosterOpen: false,
      sort: window.localStorage.getItem('rosterSort') || 'earliest',
      showPastEvents: false,
      rosters: null
    };
    this.toggleNewRosterOpen = this.toggleNewRosterOpen.bind(this);
    this.togglePastEvents = this.togglePastEvents.bind(this);
    this.getRosters = this.getRosters.bind(this);
  }

  componentWillMount() {
    this.props.setTitle('Home');
    this.getRosters(this.state.sort);
  }

  async getRosters(sort = this.state.sort) {
    const query = `
    query ($sort: String) {
      events(sort: $sort) {
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
    const variables = {
      sort
    };
    const rosters = await queryAPI(query, variables).then(data => data.data.events);
    this.setState({ rosters, sort });
  }

  toggleNewRosterOpen() {
    this.setState(prevState => ({ newRosterOpen: !prevState.newRosterOpen }));
  }

  togglePastEvents() {
    this.setState(prevState => ({ showPastEvents: !prevState.showPastEvents }));
  }

  render() {
    // const { newPostOpen, sort, posts } = this.state;
    const { user } = this.props;
    const { newRosterOpen, showPastEvents, sort, rosters } = this.state;
    return (
      <main>
        {this.state.newRosterOpen &&
          <NewRoster
            newRosterOpen={newRosterOpen}
            toggleNewRosterOpen={this.toggleNewRosterOpen}
            refreshRosters={this.getRosters}  
          />
        }
        <RostersSection
          user={user}
          rosters={rosters}
          newRosterOpen={newRosterOpen}
          toggleNewRosterOpen={this.toggleNewRosterOpen}
          showPastEvents={showPastEvents}
          togglePastEvents={this.togglePastEvents}
          sort={sort}
          refreshRosters={this.getRosters}
        />
      </main>
    );
  }
}
