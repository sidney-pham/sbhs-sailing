import React from 'react';
import ResultsList from '../results-list';
import queryAPI from '../../../utilities/request';
import styles from './style.css';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      sort: window.localStorage.getItem('resultSort') || 'earliest'
    };
    this.getResults = this.getResults.bind(this);
    this.changeSort = this.changeSort.bind(this);
  }

  componentWillMount() {
    this.props.setTitle('Results');
    this.getResults(this.state.sort);
  }

  async getResults(sort = this.state.sort) {
    const query = `
    query ($sort: String) {
      results(sort: $sort) {
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
      sort
    };
    const { results } = await queryAPI(query, variables).then(data => data.data);
    this.setState({ results, sort });
  }

  changeSort(event) {
    window.localStorage.setItem('resultSort', event.target.value);
    this.getResults(event.target.value);
  }

  render() {
    const { user } = this.props;
    const { results, sort } = this.state;
    return (
      <main>
        <div className={styles.topBar}>
          <h2 className={styles.title}>Results</h2>
          <label className={styles.sortLabel}>Sort By:
            <select value={sort} onChange={this.changeSort}>
              <option value="earliest">Date (earliest - latest)</option>
              <option value="latest">Date (latest - earliest)</option>
            </select>
          </label>
        </div>
        <ResultsList 
          user={user}
          results={results}
          refreshResults={this.getResults}
        />
      </main>
    );
  }
}
