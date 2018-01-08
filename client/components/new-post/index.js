import React from 'react';
import styles from './style.css';

function FormattingTable() {
  return (
    <table className={styles.formattingHelpTable}>
      <thead>
        <tr>
          <th>You type:</th>
          <th>You see:</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>*italics*</td>
          <td><em>italics</em></td>
        </tr>
        <tr>
          <td>**bold**</td>
          <td><b>bold</b></td>
        </tr>
        <tr>
          <td>[Sydney Boys High School!](http://www.sydneyboyshigh.com)</td>
          <td><a href="http://www.sydneyboyshigh.com">Sydney Boys High School!</a></td>
        </tr>
        <tr>
          <td>* item 1<br />* item 2<br />* item 3</td>
          <td><ul><li>item 1</li><li>item 2</li><li>item 3</li></ul></td>
        </tr>
        <tr>
          <td>&gt; quoted text</td><td><blockquote>quoted text</blockquote></td>
        </tr>
        <tr>
          <td># Large Header</td>
          <td><h1>Large Header</h1></td>
        </tr>
        <tr>
          <td>### Small header</td>
          <td><h3>Small header</h3></td>
        </tr>
        <tr>
          <td>
            {/* Apparently newlines in <pre> get ignored in React?!? */}
            <pre>{`
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
            `}</pre>
          </td>
          <td>
            <table>
              <thead>
                <tr>
                  <th>Tables</th>
                  <th style={{ textAlign: 'center' }}>Are</th>
                  <th style={{ textAlign: 'right' }}>Cool</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>col 3 is</td>
                  <td style={{ textAlign: 'center' }}>right-aligned</td>
                  <td style={{ textAlign: 'right' }}>$1600</td>
                </tr>
                <tr>
                  <td>col 2 is</td>
                  <td style={{ textAlign: 'center' }}>centered</td>
                  <td style={{ textAlign: 'right' }}>$12</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default class NewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      formattingHelpOpen: false
    };
    this.toggleFormattingHelp = this.toggleFormattingHelp.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  toggleOpen() {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  }

  toggleFormattingHelp() {
    this.setState(prevState => ({
      formattingHelpOpen: !prevState.formattingHelpOpen
    }));
  }

  render() {
    return (
      <section className={styles.newPost}>
        <form noValidate>
          <div className={styles.topBar}>
            <h2 className={styles.title}>New Post</h2>
            <button type="button" className={styles.closeButton} onClick={this.toggleOpen}>{this.state.open ? 'Close' : 'Open'}</button>
          </div>
          { this.state.open &&
            <div>
              <input className={styles.postTitle} type="text" placeholder="Title" maxLength="100" required />
              <textarea className={styles.postContent} autoCorrect="off" autoCapitalize="off" spellCheck="false" tabIndex="0" maxLength="10000" placeholder="Content"></textarea>
              <ul className="error-list"></ul> {/* TODO: Make into a component. */}
              <button>Submit</button>
              <button type="button" onClick={this.toggleFormattingHelp}>
                {this.state.formattingHelpOpen ? 'Hide' : 'Formatting Help'}
              </button>
              { this.state.formattingHelpOpen &&
                <div className={styles.formattingHelp}>
                  <p>You can use Github-flavoured <a href="http://daringfireball.net/projects/markdown/syntax">Markdown</a> for formatting. See below for some basics, or use <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">the Markdown Cheatsheet</a> for a quick and easy reference.</p>
                  <p>Note: Use two newlines for a new paragraph.</p>
                  <FormattingTable />
                </div>
              }
            </div>
          }
        </form>
      </section>
    );
  }
}
