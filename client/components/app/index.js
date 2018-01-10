import React from 'react';
import Header from '../header';
import Main from '../main';
import queryAPI from '../../utilities/request';
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
    const user = await queryAPI(query).then(data => data.data.me);
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
