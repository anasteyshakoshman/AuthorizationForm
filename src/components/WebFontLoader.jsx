import { Component } from 'react';
import PropTypes from 'prop-types';
import WebFont from 'webfontloader';

class WebFontLoader extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  state = {
    loaded: false,
  };

  componentDidMount() {
    const { config } = this.props;

    WebFont.load({
      ...config,
      active: () => this.setState({ loaded: true }),
    });
  }

  render() {
    const { children } = this.props;
    const { loaded } = this.state;

    return loaded ? children : null;
  }
}

export default WebFontLoader;
