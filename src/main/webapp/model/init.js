import {fetchOwnProfile} from './profile';
import {fetchCourses} from './courses';
import {fetchNews} from './news';

export default (dispatch) => {
  dispatch(fetchOwnProfile());
  dispatch(fetchCourses());
  dispatch(fetchNews());
}
