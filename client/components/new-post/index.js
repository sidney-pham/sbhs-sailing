import React from 'react';
import classNames from 'classnames';
import ResizingTextarea from '../resizing-textarea';
import queryAPI from '../../utilities/request';
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
      formattingHelpOpen: false,
      title: '',
      content: ''
    };
    this.toggleFormattingHelp = this.toggleFormattingHelp.bind(this);
    this.confirmBeforeClosing = this.confirmBeforeClosing.bind(this);
    this.addPost = this.addPost.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleContent = this.handleContent.bind(this);
  }

  toggleFormattingHelp() {
    this.setState(prevState => ({
      formattingHelpOpen: !prevState.formattingHelpOpen
    }));
  }

  confirmBeforeClosing(event) {
    const someContent = this.state.title || this.state.content;
    const close = someContent
      ? window.confirm('You will lose your new post, are you sure you want to close?')
      : true;
    if (close) {
      this.props.toggleNewPostOpen(event);
    }
  }

  async addPost(event) {
    event.preventDefault();

    const query = `
    mutation ($post: PostInput!) {
      addPost(post: $post) {
        id
      }
    }
    `;
    const variables = {
      post: {
        title: this.state.title,
        content: this.state.content
      }
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

  handleTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleContent(event) {
    this.setState({ content: event.target.value });
  }

  render() {
    return (
      <section className={styles.newPost}>
        <form onSubmit={this.addPost}>
          <div className={styles.topBar}>
            <h2 className={styles.title}>New Post</h2>
            {this.props.newPostOpen &&
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
              value={this.state.title}
              placeholder="Title"
              maxLength="100"
              autoFocus
              required
            />
            <ResizingTextarea
              className={styles.postContent}
              onChange={this.handleContent}
              value={this.state.content}
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
