import {createActions, handleActions} from 'redux-actions';
import {
  getCourses,
  getCourseDetails,
  saveCourse,
  createNewCourse,
  saveNewCourse,
  signIn as signInApiCall,
  signOut as signOutApiCall
} from '../../service/courses';
import {viewPath, setPath, assignPath, togglePath} from "../../utils/RamdaUtils";

export const MODE = {
  CREATE: {
    title: 'neuer Kurs',
    readonly: false,
  },
  VIEW: {
    title: 'Kursdetails',
    readonly: true,
  },
  MODIFY: {
    title: 'bearbeiten',
    readonly: false,
  }
};

// TODO craeteCourse in Backend /courses/create (GET for new DTO) + courses/create (POST for save)
export const NEW_COURSE = {
  id: 'create',
  type: 'NORMAL',
  maxParticipants: 12,
};

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
    CREATE: {
      PENDING: undefined,
      SUCCESS: course => course,
      ERROR: error => error
    },
    SAVE: {
      PENDING: undefined,
      SUCCESS: course => course,
      ERROR: error => error
    },
    COURSE_DETAILS: {
      SHOW: undefined,
      HIDE: undefined,
      TOGGLE_ATTENDEE_LIST: undefined,
      TOGGLE_EDIT_COURSE: undefined,
      ON_COURSE_DETAILS_CHANGE: (id, value) => ({id: id, value: value}),
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

export const fetchCourses = filterOptions => {
  return dispatch => {
    dispatch(actions.courses.load.pending());
    return getCourses(filterOptions)
      .then(courses => dispatch(actions.courses.load.success(courses)))
      .catch(error => dispatch(actions.courses.load.error(error)));
  };
};

export const createCourse = filterOptions => {
  return dispatch => {
    dispatch(actions.courses.create.pending());
    dispatch(actions.courses.courseDetails.show());
    return createNewCourse(filterOptions)
      .then(course => dispatch(actions.courses.create.success(course)))
      .catch(error => dispatch(actions.courses.create.error(error)));
  };
};

export const showCourseDetails = id => {
  return dispatch => {
    dispatch(actions.courses.courseDetails.pending());
    dispatch(actions.courses.courseDetails.show());
    return getCourseDetails(id)
      .then(details => dispatch(actions.courses.courseDetails.success(details)))
      .catch(error => dispatch(actions.courses.courseDetails.error(error)));
  };
};

export const hideCourseDetails = () => {
  return dispatch => {
    dispatch(actions.courses.courseDetails.hide());
  }
};

export const saveCourseDetails = course => {
  return dispatch => {
    dispatch(actions.courses.save.pending());

    if (course.id) {
      return saveCourse(course)
        .then(updatedCourse => dispatch(actions.courses.save.success(updatedCourse)))
        .catch(error=> dispatch(actions.courses.save.error(error)));
    } else {
      return saveNewCourse(course)
        .then(updatedCourse => dispatch(actions.courses.save.success(updatedCourse)))
        .catch(error=> dispatch(actions.courses.save.error(error)));
    }
  };
};

export const toggleAttendeeList = () => {
  return dispatch => dispatch(actions.courses.courseDetails.toggleAttendeeList());
};

export const toggleEditCourse = () => {
  return dispatch => dispatch(actions.courses.courseDetails.toggleEditCourse());
};

export const onCourseDetailsChange = (id, value) => {
  return dispatch => dispatch(actions.courses.courseDetails.onCourseDetailsChange(id, value));
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
  const courses = Object.assign([], state.data);
  for (const idx in courses) {
    if (courses[idx].id === course.id) {
      courses[idx] = course;
      return setPath(['data'], courses, state);
    }
  }
  return state;
};

export default handleActions({
  [actions.courses.load.pending]: state => setPath(['pending'], true, state),
  [actions.courses.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, errorMessage: null}, state),
  [actions.courses.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state),

  [actions.courses.create.pending]: state => setPath(['courseDetails', 'pending'], true, state),
  [actions.courses.create.success]: (state, {payload}) =>
    assignPath(['courseDetails'],
      {pending: false, mode: MODE.CREATE, course: payload}, state),
  [actions.courses.create.error]: (state, {payload}) =>
    assignPath(['courseDetails'], {pending: false, errorMessage: payload.message}, state),

  [actions.courses.courseDetails.show]: state =>
    assignPath(['courseDetails'], {show: true, mode: MODE.VIEW}, state),
  [actions.courses.courseDetails.hide]: state =>
    setPath(['courseDetails', 'show'], false, state),
  [actions.courses.courseDetails.pending]: state =>
    setPath(['courseDetails'], {pending: true, course: {}}, state),
  [actions.courses.courseDetails.success]: (state, {payload}) =>
    assignPath(['courseDetails'], {pending: false, course: payload}, state),
  [actions.courses.courseDetails.error]: (state, {payload}) =>
    assignPath(['courseDetails'], {pending: false, errorMessage: payload.message}, state),
  [actions.courses.courseDetails.toggleAttendeeList]: state =>
    togglePath(['courseDetails', 'showAttendees'], state),
  [actions.courses.courseDetails.toggleEditCourse]: state => {
    const nextMode = viewPath(['courseDetails', 'mode'], state) === MODE.VIEW
      ? MODE.MODIFY
      : MODE.VIEW;
    return setPath(['courseDetails', 'mode'], nextMode, state)
  },
  [actions.courses.courseDetails.onCourseDetailsChange]: (state, {payload}) =>
    setPath(['courseDetails', 'course', payload.id], payload.value, state),
  [actions.courses.signIn.success]: (state, {payload}) => updateCourse(state, payload),
  [actions.courses.signOut.success]: (state, {payload}) => updateCourse(state, payload),
  [actions.courses.save.success]: (state, {payload}) => updateCourse(state, payload)
}, initialState);
