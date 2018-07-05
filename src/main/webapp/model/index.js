import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import logger from 'redux-logger';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [
  thunk,
  logger
].filter(Boolean);

export default createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleware))
);
