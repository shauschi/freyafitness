import {fetchProfile} from './profile';
import {fetchCourses} from './courses';

export default (dispatch) => {
  dispatch(fetchProfile(10 /* TODO ID setzen */));
  dispatch(fetchCourses());
}
