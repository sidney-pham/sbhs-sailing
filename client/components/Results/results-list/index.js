import React from 'react';
import Result from '../result';
import styles from './style.css';


export default function ResultsList(props) {
  const { results } = props;
  if (!results) {
    return <p>Loading results...</p>;
  }

  if (results.length === 0) {
    return <p>No results yet!</p>;
  }

  return (
    <ul className={styles.resultsList}>
      {results.map(result => (
        <Result
          key={result.id}
          result={result}
          user={props.user}
          refreshResults={props.refreshResults}
        />
      ))
      }
    </ul>
  );
}
