import {combineReducers} from 'redux';
import courses from './courses';
import courseTypes from './coursetypes';
import drawer from './drawer';
import news from './news';
import password from './password';
import profile from './profile';

export default combineReducers({
  courses,
  courseTypes,
  drawer,
  news,
  password,
  profile
})
