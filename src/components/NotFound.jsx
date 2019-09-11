import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class NotFound extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className="page-not-found">
        <div className="page-not-found-container">
          <h1>404</h1>
          <h2>Страница не найдена :(</h2>
          <div className="back-link" onClick={this.goBack}>Назад</div>
        </div>
      </div>
    );
  }
}

export default withRouter(NotFound);
