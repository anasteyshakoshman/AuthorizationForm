import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import TekoLogo from '../../assets/svg/teko-logo.svg';

export default class Main extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: {
        isAuthenticated: false,
        login: '',
      },
    };
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    const token = localStorage ? localStorage.getItem('token') : null;
    axios.get('/users/me/' + token)
      .then((response) => {
        const user = response.data;
        this.setState({ loading: false, user: { ...user, isAuthenticated: true } });
      })
      .catch(() => {
        this.setState({ loading: false, user: { isAuthenticated: false } });
      });
  }

  render() {
    const { loading, user } = this.state;

    if (loading) {
      return (
        <div className="main-page">
          <p> Загрузка...</p>
        </div>
      );
    }

    if (!user.isAuthenticated) {
      return <Redirect to="/auth" />;
    }

    return (
      <div className="main-page">
        <br />
        <TekoLogo />
        <br />
        <p>{ 'Hello, ' + user.login}</p>
      </div>
    );
  }
}
