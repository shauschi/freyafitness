'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';
import App from './App.jsx';
import {Provider} from 'react-redux';
import store from './model';
import moment from 'moment';
import deLocale from 'moment/locale/de';

moment.updateLocale("de", deLocale);

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App/>
    </HashRouter>
  </Provider>,
  document.getElementById('app')
);
