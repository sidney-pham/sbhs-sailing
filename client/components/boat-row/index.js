import React from 'react';

export default class BoatRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const newBoat = { ...this.props.boat };
    newBoat[event.target.name] = event.target.value;
    this.props.handleBoats(this.props.rowIndex, newBoat);
  }

  render() {
    const { boat } = this.props;
    return (
      <tr onChange={this.handleChange}>
        <td>
          <input type="text" value={boat.skipper} name="skipper" placeholder="Required" required />
        </td>
        <td>
          <input type="text" value={boat.crew} name="crew" placeholder="Required" required />
        </td>
        <td>
          <input type="text" value={boat.boat} name="boat" placeholder="Required" required />
        </td>
        <td>
          <input type="text" value={boat.sailNumber} name="sailNumber" placeholder="Required" required />
        </td>
      </tr>
    );
  }
}
