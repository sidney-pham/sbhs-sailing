import React from 'react';
import classNames from 'classnames';
import queryAPI from '../../utilities/request';
import styles from './style.css';

export default class NewRoster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: ''
    };
    this.confirmBeforeClosing = this.confirmBeforeClosing.bind(this);
    this.addRoster = this.addRoster.bind(this);
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

  render() {
    return (      
      <section className={styles.newPost}>
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
            <input
              className={styles.postTitle}
              onChange={this.handleTitle}
              type="text"
              name="title"
              value={this.state.title}
              placeholder="Title"
              maxLength="100"
              autoFocus
              required
            />
            <textarea
              className={styles.postContent}
              onChange={this.handleContent}
              name="content"
              value={this.state.content}
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              tabIndex="0"
              maxLength="10000"
              placeholder="Content"
              required
            />
            <button type="submit" className="smallButton">
              <i className="fa fa-check" aria-hidden="true"></i>Submit
            </button>
            <button type="button" className="textButton" onClick={this.toggleFormattingHelp}>
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
        </form>
      </section>
    );
  }
}
