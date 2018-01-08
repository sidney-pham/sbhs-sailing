import React from 'react';
import {
  Link,
  NavLink
} from 'react-router-dom';
import styles from './style.css';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getName = this.getName.bind(this);
  }

  getName() {
    let name;
    if (this.props.user) {
      const { user } = this.props;
      const nameExists = user.firstName && user.surname;
      name = nameExists ? `${user.firstName} ${user.surname}` : 'No Name';
    } else {
      name = 'Not logged in!';
    }
    return name;
  }

  render() {
    return (
      <header className={styles.header}>
        <div className={styles.banner}>
          <Link to="/">
            <img src="/images/sbhs_crest.png" alt="SBHS Crest" className={styles.SBHSCrest} />
          </Link>
          <h1 className={styles.title}>SBHS Sailing Portal</h1>
        </div>
        <nav className={styles.navigation}>
          <ul className={styles.navigationList}>
            <li>
              <NavLink exact to="/" activeClassName="active">
                <i className="fa fa-home" aria-hidden="true"></i>HOME
              </NavLink>
            </li>
            <li>
              <NavLink to="/rosters" activeClassName="active">
                <i className="fa fa-id-card-o" aria-hidden="true"></i>ROSTERS
              </NavLink>
            </li>
            <li>
              <NavLink to="/results" activeClassName="active">
                <i className="fa fa-newspaper-o" aria-hidden="true"></i>RESULTS
              </NavLink>
            </li>
            <li tabIndex="-1" className={styles.userProfile}>
              <Link to="#" className={styles.dropdownButton} onClick={event => event.target.focus()}>
                <i className="fa fa-user" aria-hidden="true"></i>{this.getName()}<i className="fa fa-caret-down" aria-hidden="true"></i>
              </Link>
              <ul className={styles.dropdownMenu}>
                {/* Send request to server instead of being handled by react-router.
                See https://github.com/ReactTraining/react-router/issues/3109#issuecomment-189782650 */}
                <Link to="/logout" target="_self">
                  <i className="fa fa-sign-out" aria-hidden="true"></i>Logout
                </Link>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
