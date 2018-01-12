import React from 'react';
import styles from './style.css';

// Shows errors for server side errors. Currently unused.
export default class ErrorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { errors } = this.props;
    return (
      <ul className={styles.errorList}></ul>
    );
  }
}
