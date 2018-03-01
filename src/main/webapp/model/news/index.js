import {createActions, handleActions} from 'redux-actions';
import {getNews} from '../../service/news';
import {setPath, assignPath} from "../../utils/RamdaUtils";

const initialState = {
  pending: false,
  data: []
};

export const actions = createActions({
  NEWS: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: news => news,
      ERROR: error => error
    }
  }
});

export const fetchNews = (filterOptions) => {
  return dispatch => {
    dispatch(actions.news.load.pending());
    return getNews(filterOptions)
      .then(profile => dispatch(actions.news.load.success(profile)))
      .catch(error => dispatch(actions.news.load.error(error)))
  }
};

export default handleActions({
  [actions.news.load.pending]: state => setPath(['pending'], true, state),
  [actions.news.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, errorMessage: null}, state),
  [actions.news.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state),
}, initialState);
