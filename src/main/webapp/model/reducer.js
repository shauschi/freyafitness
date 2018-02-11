import {combineReducers} from 'redux';
import courses from './courses';
import drawer from './drawer';
import news from './news';
import password from './password';
import profile from './profile';

export default combineReducers({
  courses,
  drawer,
  news,
  password,
  profile
})
