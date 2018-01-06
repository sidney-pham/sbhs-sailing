import React from 'react';
import {
  Link,
  NavLink
} from 'react-router-dom';
import './style.css';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getName = this.getName.bind(this);
  }

  getName() {
    let name;
    if (this.props.user) {
      console.log('In header: ', this.props.user);
      const { user } = this.props;
      name = `${user.firstName} ${user.surname}`;
    } else {
      name = 'Not logged in!';
    }
    return name;
  }

  render() {
    return (
      <header>
        <div className="banner">
          <Link to="/">
            <img src="/images/sbhs_crest.png" alt="SBHS Crest" id="sbhs-crest" />
          </Link>
          <h1 id="title">SBHS Sailing Portal</h1>
        </div>
        <nav>
          <ul className="navigation">
            <li>
              <NavLink exact to="/" activeClassName="active">
                <i className="fa fa-home" aria-hidden="true"></i>HOME
              </NavLink>
              <NavLink to="/rosters" activeClassName="active">
                <i className="fa fa-id-card-o" aria-hidden="true"></i>ROSTERS
              </NavLink>
              <NavLink to="/results" activeClassName="active">
                <i className="fa fa-newspaper-o" aria-hidden="true"></i>RESULTS
              </NavLink>
            </li>
            <div className="dropdown">
              <li className="user-profile dropdown-button" onClick={() => this.focus()} tabIndex="-1">
                <Link to="#">
                  <i className="fa fa-user" aria-hidden="true"></i>{this.getName()}<i className="fa fa-caret-down" aria-hidden="true"></i>
                </Link>
              </li>
              <ul className="dropdown-menu">
                <Link to="/logout">
                  <i className="fa fa-sign-out" aria-hidden="true"></i>Logout
                </Link>
              </ul>
            </div>
          </ul>
        </nav>
      </header>
    );
  }
}
