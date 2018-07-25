import {combineReducers} from 'redux';
import contact from './contact';
import courses from './courses';
import courseTypes from './coursetypes';
import drawer from './drawer';
import news from './news';
import notification from './notification';
import membership from './membership';
import membershipTypes from './membershiptypes';
import password from './password';
import profile from './profile';

export default combineReducers({
  contact,
  courses,
  courseTypes,
  drawer,
  news,
  notification,
  membership,
  membershipTypes,
  password,
  profile
})
