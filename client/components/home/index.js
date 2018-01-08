import React from 'react';
import styles from './style.css';
console.log(styles);

function NewPost() {
  return (
    <section className="new-post">
      <form noValidate>
        <div className="new-post-top-bar">
          <h2 id="new-post-header">New Post</h2>
          <button className="trim-button small-button" type="button" id="close-new-post-button">Close</button>
        </div>
        <input type="text" id="new-post-title" placeholder="Title" maxLength="100" required />
        <textarea autoCorrect="off" autoCapitalize="off" spellCheck="false" tabIndex="0" maxLength="10000" placeholder="Content" id="new-post-content"></textarea>
        <ul className="error-list"></ul>
        <button className="trim-button submit-button-small" id="submit-button">Submit</button>
        <a id="formatting-help-button" href="javascript: void 0;">Formatting Help</a>
        <div id="formatting-help">
          <p>You can use Github-flavoured <a href="http://daringfireball.net/projects/markdown/syntax">Markdown</a> for formatting. See below for some basics, or use <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">the Markdown Cheatsheet</a> for a quick and easy reference.</p>
          <p>Note: Use two newlines for a new paragraph.</p>
          <table>
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
                  <pre>
    | Tables        | Are           | Cool  |
    | ------------- |:-------------:| -----:|
    | col 3 is      | right-aligned | $1600 |
    | col 2 is      | centered      |   $12 |
                  </pre>
                </td>
                <td>
                  <table>
                    <thead>
                      <tr>
                        <th>Tables</th>
                        <th style={{textAlign:'center'}}>Are</th>
                        <th style={{textAlign:'right'}}>Cool</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>col 3 is</td>
                        <td style={{textAlign:'center'}}>right-aligned</td>
                        <td style={{textAlign:'right'}}>$1600</td>
                      </tr>
                      <tr>
                        <td>col 2 is</td>
                        <td style={{textAlign:'center'}}>centered</td>
                        <td style={{textAlign:'right'}}>$12</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </section>
  );
}

function LatestNews() {
  return (
    <section className="latest-news">
      <div className="top-bar">
        <h2 id="latest-news-header">Latest News</h2>
        <label className="sort-label" htmlFor="posts-sort">Sort by:</label>
        <select value="new" className="posts-sort" id="posts-sort" onChange={() => console.log('blah')}>
          <option value="new">New</option>
          <option value="old">Old</option>
          <option value="top">Top</option>
        </select>
        <button type="button" id="new-post-button" className="trim-button small-button"><i className="fa fa-plus" aria-hidden="true"></i>New Post</button>
      </div>
      <p className="latest-news-message">Loading...</p>
    </section>
  );
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.setTitle('Home');
  }

  render() {
    const { user } = this.props;
    return (
      <main>
        <NewPost />
        {/* <LatestNews user={user}/> */}
      </main>
    );
  }
}
