import {fetchOwnProfile} from './profile';
import {fetchCourses} from './courses';

export default (dispatch) => {
  dispatch(fetchOwnProfile());
  dispatch(fetchCourses());
}
