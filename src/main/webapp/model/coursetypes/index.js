import {createActions, handleActions} from 'redux-actions';
import {getCourseTypes} from '../../service/coursetypes';
import {setPath, assignPath} from "../../utils/RamdaUtils";

const initialState = {
  pending: false,
  data: []
};

export const actions = createActions({
  COURSE_TYPES: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: news => news,
      ERROR: error => error
    }
  }
});

export const fetchCourseTypes = (filterOptions) => {
  return dispatch => {
    dispatch(actions.courseTypes.load.pending());
    return getCourseTypes(filterOptions)
      .then(courseTypes => dispatch(actions.courseTypes.load.success(courseTypes)))
      .catch(error => dispatch(actions.courseTypes.load.error(error)))
  }
};

export default handleActions({
  [actions.courseTypes.load.pending]: state => setPath(['pending'], true, state),
  [actions.courseTypes.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, errorMessage: null}, state),
  [actions.courseTypes.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state),
}, initialState);
