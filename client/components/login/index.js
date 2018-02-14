import React from 'react';
import classNames from 'classnames';
import styles from './style.css';

function SBHSLogin(props) {
  return (
    <div>
      <button className={classNames(styles.trimButton, styles.SBHSButton)}>
        <a href="/login/sbhs">
          <i className="fa fa-sign-in" aria-hidden="true"></i>Login with SBHS Account
        </a>
      </button>
      <button className={classNames(styles.textButton, styles.nonSBHSButton)} onClick={props.toggleLogin}>I don't have an SBHS Login!</button>
    </div>
  );
}

class NonSBHSLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loginText: 'Log in',
      error: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async login(event) {
    event.preventDefault();
    const { email, password } = this.state;

    this.setState({ loginText: 'Logging in...' });
    const data = await fetch('/login', {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email, password })
    }).then(res => res.json());

    if (data.success) {
      // Logged in.
      window.location.href = '/';
    } else {
      // Wrong email or password.
      this.setState({ error: data.message });
      // Show 'Huh?' for a second.
      this.setState({ loginText: 'Huh?' });
      setTimeout(() => {
        this.setState({ loginText: 'Log in' });
      }, 1000);
    }
  }

  render() {
    return (
      <div className={styles.nonSBHSLogin}>
        <form onSubmit={this.login}>
          <input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required autoFocus />
          <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required />
          <p className={styles.errorMessage}>{this.state.error}</p>
          <button className={classNames(styles.trimButton, styles.submitButton)}>{this.state.loginText}</button>
          <button className={styles.textButton} type="button" onClick={this.props.toggleLogin}>
            <i className="fa fa-chevron-left" aria-hidden="true"></i>Back
          </button>
        </form>
      </div>
    );
  }
}

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAltLogin: false
    };
    this.toggleLogin = this.toggleLogin.bind(this);
  }

  toggleLogin() {
    this.setState(prevState => ({ showAltLogin: !prevState.showAltLogin }));
  }

  render() {
    return (
      <div>
        <header className={styles.header}>
          <a href="/">
            <img src="images/sbhs_crest.png" alt="SBHS Crest" className={styles.SBHSCrest} />
          </a>
          <h1 className={styles.title}>Sydney Boys High School Sailing Portal</h1>
        </header>
        <main>
          <h2 className={styles.loginTitle}>LOGIN</h2>
          {!this.state.showAltLogin ?
            <SBHSLogin toggleLogin={this.toggleLogin} /> :
            <NonSBHSLogin toggleLogin={this.toggleLogin} />
          }
        </main>
      </div>
    );
  }
}
