import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button } from 'antd';

export default class Auth extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      login: '',
      password: '',
      error: '',
    };
  }

  handleChangeLogin = (event) => {
    this.setState({ login: event.target.value });
  };

  handleChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { login, password } = this.state;
    if (!login || !password) {
      this.setState({
        error: 'Please, fill the fields!',
        loading: false,
      });
    } else {
      this.setState({ loading: true, error: '' });
      axios.post('/auth/login', { login, password })
        .then((response) => {
          if (localStorage) {
            localStorage.setItem('token', response.data.token);
          }
          this.props.history.push('/');
        }).catch(() => {
          this.setState({
            error: 'Incorrect login or password',
            loading: false,
          });
        });
    }
  };

  render() {
    const { loading, login, password, error } = this.state;
    return (
      <div className="auth-page">
        <form onSubmit={this.handleSubmit}>
          <h2>Login</h2>
          <br />
          <input type="text" placeholder="Username" value={login} onChange={this.handleChangeLogin} />
          <br />
          <input type="password" placeholder="Password" value={password} onChange={this.handleChangePassword} />
          <br />
          <Button type="primary" htmlType="submit">Sign in</Button>
          <br />
          {error && (<p className="error">{error}</p>)}
          {loading && (<p className="loading">Loading...</p>)}
          <br />
          <a href="">Lost your Password?</a>
        </form>
        <p>
          Don&apos;t have an account?
          <a href=""> Sign up here!</a>
        </p>
      </div>
    );
  }
}
