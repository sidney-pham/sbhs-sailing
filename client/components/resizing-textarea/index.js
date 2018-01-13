import React from 'react';
import classNames from 'classnames';
import styles from './style.css';

export default class ResizingTextarea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  // We need to resize the textArea on mounting so the text doesn't overflow.
  componentDidMount() {
    const { textArea } = this;
    const content = textArea.value;
    if (content === '') {
      textArea.style.height = '';
    } else {
      textArea.style.height = 'auto';
      textArea.style.height = `${Math.max(textArea.scrollHeight, 100)}px`;
    }
  }

  handleChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    const textArea = event.target;
    const content = textArea.value;
    if (content === '') {
      textArea.style.height = '';
    } else {
      textArea.style.height = 'auto';
      textArea.style.height = `${Math.max(textArea.scrollHeight, 100)}px`;
    }
  }

  render() {
    const { className, ...other } = this.props;
    return (
      <textarea
        {...this.props}
        className={classNames(className, styles.textArea)}
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        tabIndex="0"
        ref={textArea => {
          this.textArea = textArea
        }}
        onChange={this.handleChange}
      />
    );
  }
}
