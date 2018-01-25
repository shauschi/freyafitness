import {combineReducers} from 'redux';
import profile from './profile';
import drawer from './drawer';
import courses from './courses';
import password from './password';

export default combineReducers({
  profile, drawer, courses, password
})
