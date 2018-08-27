import {createActions, handleActions} from 'redux-actions';
import {
  addUserToCourse as addUserToCourseApiCall,
  createNewCourse,
  deleteCourse as deleteCourseApiCall,
  getCourseDetails,
  getCourses,
  removeUserFromCourse as removeUserFromCourseApiCall,
  saveCourse,
  saveNewCourse,
  signIn as signInApiCall,
  signOut as signOutApiCall
} from '../../service/courses';
import {showNotification} from './../notification';
import {assignPath, setPath, viewPath} from '../../utils/RamdaUtils';

export const MODE = {
  CREATE: {
    title: 'Neuen Kurs anlegen',
    readonly: false,
  },
  VIEW: {
    title: 'Kursdetails',
    readonly: true,
  },
  MODIFY: {
    title: 'Kurs bearbeiten',
    readonly: false,
  }
};

const initialState = {
  pending: false,
  data: [],
  courseDetails: {edit: false},
  delete: {
    pending: false,
    errorMessage: ''
  }
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
    DELETE: {
      PENDING: undefined,
      SUCCESS: courseId => courseId,
      ERROR: error => error
    },
    SAVE: {
      PENDING: undefined,
      SUCCESS: course => course,
      ERROR: error => error
    },
    COURSE_DETAILS: {
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
    },
    ADD_USER: {
      PENDING: undefined,
      SUCCESS: course => course,
      ERROR: error => error
    },
    REMOVE_USER: {
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
    return createNewCourse(filterOptions)
      .then(course => dispatch(actions.courses.create.success(course)))
      .catch(error => dispatch(actions.courses.create.error(error)));
  };
};

export const showCourseDetails = id => {
  return dispatch => {
    dispatch(actions.courses.courseDetails.pending());
    return getCourseDetails(id)
      .then(details => dispatch(actions.courses.courseDetails.success(details)))
      .catch(error => dispatch(actions.courses.courseDetails.error(error)));
  };
};

export const deleteCourse = id => {
  return dispatch => {
    dispatch(actions.courses.delete.pending());
    return deleteCourseApiCall(id)
      .then(answer => {
        dispatch(actions.courses.delete.success(id));
        dispatch(showNotification(answer.message, 'success'));
      })
      .catch(error => dispatch(actions.courses.delete.error(error)));
  };
};

export const saveCourseDetails = (course, onSuccess) => {
  return dispatch => {
    dispatch(actions.courses.save.pending());
    const func = !!course.id ? saveCourse : saveNewCourse;
    return func(course)
      .then(updatedCourse => {
        dispatch(actions.courses.save.success(updatedCourse));
        onSuccess();
        dispatch(showNotification('Kurs gespeichert', 'success'));
      })
      .catch(error=> dispatch(actions.courses.save.error(error)));
  };
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
      .then(course => {
        dispatch(actions.courses.signIn.success(course));
        dispatch(showNotification('angemeldet', 'success'));
      })
      .catch(error => {
        dispatch(actions.courses.signOut.error(error));
        dispatch(showNotification(error.message, 'error'));
      });
  }
};

export const signOut = courseId => {
  return dispatch => {
    dispatch(actions.courses.signOut.pending());
    return signOutApiCall(courseId)
      .then(course => {
        dispatch(actions.courses.signOut.success(course));
        dispatch(showNotification('abgemeldet', 'success'));
      })
      .catch(error => {
        dispatch(actions.courses.signOut.error(error));
        dispatch(showNotification(error.message, 'error'));
      });
  }
};

export const addUserToCourse = (courseId, userId) => {
  return dispatch => {
    dispatch(actions.courses.addUser.pending());
    return addUserToCourseApiCall(courseId, userId)
      .then(course => {
        dispatch(actions.courses.addUser.success(course));
      })
      .catch(error => {
        dispatch(actions.courses.addUser.error(error));
        dispatch(showNotification(error.message, 'error'));
      });
  }
};

export const removeUserFromCourse = (courseId, userId) => {
  return dispatch => {
    dispatch(actions.courses.removeUser.pending());
    return removeUserFromCourseApiCall(courseId, userId)
      .then(course => {
        dispatch(actions.courses.removeUser.success(course));
        dispatch(showNotification('Teilnehmer entfernt', 'success'));
      })
      .catch(error => {
        dispatch(actions.courses.removeUser.error(error));
        dispatch(showNotification(error.message, 'error'));
      });
  }
};

const updateCourse = (state, course) => {
  const courses = Object.assign([], state.data);
  for (const idx in courses) {
    if (courses[idx].id === course.id) {
      courses[idx] = course;
      const updatedState = setPath(['data'], courses, state);
      return setPath(['courseDetails', 'course'], course, updatedState);
    }
  }
  return state;
};

const deleteCourseFromList = (state, courseId) => {
  const courses = Object.assign([], state.data);
  for (const idx in courses) {
    if (courses[idx].id === courseId) {
      courses.splice(idx, 1);
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
    assignPath(['courseDetails'], {pending: false, mode: MODE.CREATE, course: payload}, state),
  [actions.courses.create.error]: (state, {payload}) =>
    assignPath(['courseDetails'], {pending: false, errorMessage: payload.message}, state),

  // DELETE
  [actions.courses.delete.pending]: state => setPath(['delete', 'pending'], true, state),
  [actions.courses.delete.success]: (state, {payload}) => {
    const changedState = deleteCourseFromList(state, payload);
    return assignPath(['delete'], {pending: false, errorMessage: null}, changedState);
  },
  [actions.courses.delete.error]: (state, {payload}) =>
    assignPath(['delete'], {pending: false, errorMessage: payload.message}, state),

  [actions.courses.courseDetails.pending]: state =>
    setPath(['courseDetails'], {pending: true, course: {}}, state),
  [actions.courses.courseDetails.success]: (state, {payload}) =>
    assignPath(['courseDetails'], {pending: false, course: payload}, state),
  [actions.courses.courseDetails.error]: (state, {payload}) =>
    assignPath(['courseDetails'], {pending: false, errorMessage: payload.message}, state),
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
  [actions.courses.save.success]: (state, {payload}) => updateCourse(state, payload),

  [actions.courses.addUser.success]: (state, {payload}) => updateCourse(state, payload),
  [actions.courses.removeUser.success]: (state, {payload}) => updateCourse(state, payload),
}, initialState);
