import React from 'react';
import BoatRow from '../boat-row';
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
            {
              this.props.boats.map((boat, i) => (
                <BoatRow
                  key={i.toString()}
                  rowIndex={i}
                  boat={boat}
                  handleBoats={this.props.handleBoats}
                />
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}
