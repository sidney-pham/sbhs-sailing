import React from 'react';
import Header from '../header';
import Main from '../main';
import './style.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  async componentDidMount() {
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

    this.state.user = user;
  }

  render() {
    return (
      <div>
        <Header user={this.state.user}/>
        <Main />
      </div>
    );
  }
}

export default App;
