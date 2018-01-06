import React from 'react';
import Header from '../header';
import Main from '../main';
import './style.css';

function setTitle(title) {
  document.title = `${title} · SBHS Sailing`;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.getUserData = this.getUserData.bind(this);
  }

  componentWillMount() {
    this.getUserData();
  }
  
  async getUserData() {
    const query = `
    query {
      me {
        firstName
        surname
        phone
        studentID
        userLevel
        accountDisabled
        email
      }
    }
    `;
    const data = await fetch('/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    }).then(res => {
      console.log(res);
      if (res.redirected) {
        // GraphQL endpoint requires authentication so if we're not logged in,
        // it redirects us to login.
        window.location.href = res.url;
      } else {
        // All good!
        return res.json();
      }
    });

    const user = data.data.me;
    console.log(user);

    this.setState({
      user
    });
  }

  render() {
    return (
      <div>
        <Header user={this.state.user} />
        <Main user={this.state.user} setTitle={setTitle} />
      </div>
    );
  }
}

export default App;
