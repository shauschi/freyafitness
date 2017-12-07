import {createActions, handleActions} from 'redux-actions';
import {getCourses} from '../../service/courses';

const initialState = {
  pending: false,
  data: []
};

export const actions = createActions({
  COURSES: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: courses => courses,
      ERROR: error => error
    }
  }
});

export const fetchCourses = (filterOptions) => {
  return dispatch => {
    dispatch(actions.courses.load.pending())
    return getCourses(filterOptions)
      .then(courses => dispatch(actions.courses.load.success(courses)))
      .catch(error => dispatch(actions.courses.load.error(error)))
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
  )
}, initialState);
