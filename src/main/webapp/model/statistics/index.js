import {createActions, handleActions} from 'redux-actions';
import {getStatistics} from '../../service/statistics';
import {setPath, assignPath} from '../../utils/RamdaUtils';
import moment from 'moment';

const initialState = {
  pending: false,
  error: null,
  lastUpdated: null,
  data: {
    userId: null,
    favouriteCourseTypeId: null,
    favouriteCourseParticipations: null,
    participationsPerMonth: {}
  }
};

export const actions = createActions({
  STATISTICS: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: statistics => statistics,
      ERROR: error => error
    }
  }
});

export const fetchStatistics = (userId, force = false) =>
  (dispatch, getState) => {
    if (getState().statistics.lastUpdate && !force) {
      return; // TODO update every other call/day
    }
    dispatch(actions.statistics.load.pending());
    return getStatistics(userId)
      .then(statistics => dispatch(actions.statistics.load.success(statistics)))
      .catch(error => dispatch(actions.statistics.load.error(error)))
  };

export default handleActions({
  [actions.statistics.load.pending]: state => setPath(['pending'], true, state),
  [actions.statistics.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, lastUpdate: moment(), error: null}, state),
  [actions.statistics.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, error: payload.message}, state),
}, initialState);
