import {fetchOwnProfile} from './profile';
import {fetchCourses} from './courses';
import {fetchCourseTypes} from './coursetypes';
import {fetchNews} from './news';

export default (dispatch) => {
  dispatch(fetchOwnProfile());
  dispatch(fetchCourses());
  dispatch(fetchCourseTypes());
  dispatch(fetchNews());
}
