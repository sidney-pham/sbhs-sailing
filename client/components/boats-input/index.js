import React from 'react';
import styles from './style.css';

export default class BoatsInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <h4 className={styles.title}>Boats</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Skipper</th>
              <th>Crew</th>
              <th>Boat</th>
              <th>Sail Number</th>
            </tr>
          </thead>
          <tbody className={styles.body}>
            <tr>
              <td><input type="text" placeholder="Required" required /></td>
              <td><input type="text" placeholder="Required" required /></td>
              <td><input type="text" placeholder="Required" required /></td>
              <td><input type="text" placeholder="Required" required /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}