import {createActions, handleActions} from 'redux-actions';
import {getCourses, getCourseDetails} from '../../service/courses';

const initialState = {
  pending: false,
  data: [],
  courseDetails: {show: false}
};

export const actions = createActions({
  COURSES: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: courses => courses,
      ERROR: error => error
    },
    COURSE_DETAILS: {
      SHOW: undefined,
      HIDE: undefined,
      PENDING: undefined,
      SUCCESS: details => details,
      ERROR: error => error
    }
  }
});

export const fetchCourses = (filterOptions) => {
  return dispatch => {
    dispatch(actions.courses.load.pending());
    return getCourses(filterOptions)
      .then(courses => dispatch(actions.courses.load.success(courses)))
      .catch(error => dispatch(actions.courses.load.error(error)))
  };
};

export const showCourseDetails = (id) => {
  return dispatch => {
    dispatch(actions.courses.courseDetails.pending());
    dispatch(actions.courses.courseDetails.show());
    return getCourseDetails(id)
      .then(details => dispatch(actions.courses.courseDetails.success(details)))
      .catch(error => dispatch(actions.courses.courseDetails.error(error)))
  };
};

export const hideCourseDetails = () => {
  return dispatch => {
    dispatch(actions.courses.courseDetails.hide());
  }
};

export default handleActions({
  [actions.courses.load.pending]: (state, {payload}) => Object.assign(
    {}, state, {pending: true}
  ),
  [actions.courses.load.success]: (state, {payload}) => Object.assign(
    {}, state, {data: payload, pending: false}
  ),
  [actions.courses.load.error]: (state, {payload}) => Object.assign(
    {}, state, {pending: false, errorMessage: payload.message}
  ),
  [actions.courses.courseDetails.show]: (state, {payload}) => Object.assign(
    {}, state, {courseDetails: Object.assign({}, state.courseDetails, {show: true})}
  ),
  [actions.courses.courseDetails.hide]: (state, {payload}) => Object.assign(
    {}, state, {courseDetails: Object.assign({}, state.courseDetails, {show: false})}
  ),
  [actions.courses.courseDetails.pending]: (state, {payload}) => Object.assign(
    {}, state, {courseDetails: Object.assign({}, state.courseDetails, {pending: true, details: {}})}
  ),
  [actions.courses.courseDetails.success]: (state, {payload}) => Object.assign(
    {}, state, {courseDetails: Object.assign({}, state.courseDetails, {pending: false, details: payload})}
  ),
  [actions.courses.courseDetails.error]: (state, {payload}) => Object.assign(
    {}, state, {courseDetails: Object.assign({}, state.courseDetails, {pending: false, errorMessage: payload.message})}
  )
}, initialState);
