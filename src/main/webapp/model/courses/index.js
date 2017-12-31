import {createActions, handleActions} from 'redux-actions';
import {getCourses, getCourseDetails, signIn as signInApiCall, signOut as signOutApiCall} from '../../service/courses';

const initialState = {
  pending: false,
  data: [],
  courseDetails: {show: false, showAttendees: false, edit: false}
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
      TOGGLE_ATTENDEE_LIST: undefined,
      TOGGLE_EDIT_COURSE: undefined,
      PENDING: undefined,
      SUCCESS: details => details,
      ERROR: error => error
    },
    SIGN_IN: {
      PENDING: undefined,
      SUCCESS: course => course,
      ERROR: error => error
    },
    SIGN_OUT: {
      PENDING: undefined,
      SUCCESS: course => course,
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

export const toggleAttendeeList = () => {
  return dispatch => dispatch(actions.courses.courseDetails.toggleAttendeeList());
};

export const toggleEditCourse = () => {
  return dispatch => dispatch(actions.courses.courseDetails.toggleEditCourse());
};

export const signIn = courseId => {
  return dispatch => {
    dispatch(actions.courses.signIn.pending());
    return signInApiCall(courseId)
      .then(course => dispatch(actions.courses.signIn.success(course)))
      .catch(error => dispatch(actions.courses.signIn.error(error)));
  }
};

export const signOut = courseId => {
  return dispatch => {
    dispatch(actions.courses.signOut.pending());
    return signOutApiCall(courseId)
      .then(course => dispatch(actions.courses.signOut.success(course)))
      .catch(error => dispatch(actions.courses.signOut.error(error)));
  }
};

const updateCourse = (state, course) => {
  console.warn("UPDATE COURSE", course);
  const courses = Object.assign({}, state.data);
  for (const idx in courses) {
    if (courses[idx].id === course.id) {
      const coursesChanged = Object.assign([], state.data, {[idx]: course});
      return Object.assign({}, state, {data: coursesChanged});
    }
  }
  return state;
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
  ),
  [actions.courses.courseDetails.toggleAttendeeList]: (state, {payload}) => Object.assign(
    {}, state, {courseDetails: Object.assign({}, state.courseDetails, {showAttendees: !state.courseDetails.showAttendees})}
  ),
  [actions.courses.courseDetails.toggleEditCourse]: (state, {payload}) => Object.assign(
    {}, state, {courseDetails: Object.assign({}, state.courseDetails, {edit: !state.courseDetails.edit})}
  ),
  [actions.courses.signIn.success]: (state, {payload}) => updateCourse(state, payload),
  [actions.courses.signOut.success]: (state, {payload}) => updateCourse(state, payload)

}, initialState);
