import 'antd/dist/antd.css';
import './styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import App from './components/App';

moment.locale('ru');

const elemHTML = window.document.getElementsByTagName('html')[0];

if (window.navigator.userAgent.indexOf('Mac') > 0) {
  elemHTML.className += ' macOs';

  const ua = window.navigator.userAgent;

  if ((ua.indexOf('Safari') > 0) && (ua.indexOf('Chrome') < 0)) elemHTML.className += ' macSafari';
  if (ua.indexOf('Chrome') > 0) elemHTML.className += ' macChrome';
}

if (!(window.ActiveXObject) && 'ActiveXObject' in window) {
  elemHTML.className += ' ie11';
}

ReactDOM.render(<App />, window.document.getElementById('app'));
