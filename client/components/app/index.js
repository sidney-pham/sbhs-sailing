import React from 'react';
import Header from '../header';
import Main from '../main';
import './style.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'Sidney Pham'
    };
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
