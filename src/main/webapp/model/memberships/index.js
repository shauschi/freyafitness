import {createActions, handleActions} from 'redux-actions';
import {assignPath, setPath} from '../../utils/RamdaUtils';
import {showNotification} from '../notification';
import {
  fetchMemberships as fetchMembershipsApiCall,
  createMembership as createMembershipApiCall,
  fetchMembership as fetchMembershipApiCall,
  saveMembership as saveMembershipApiCall,
  deleteMembership as deleteMembershipApiCall,
} from '../../service/membership';
import moment from 'moment';
import {deleteParticipation as deleteParticipationApiCall} from "../../service/participations";

export const initialState = {
  pending: false,
  lastUpdate: undefined,
  data: [],
  create: {
    show: false,
    pending: false,
    errorMessage: '',
    data: {
      user: {},
      membershipTypeId: null,
      validity: {},
    }
  },
  details: {
    pending: false,
    lastUpdate: undefined,
    error: undefined,
    data: {
      id: null,
      user: {},
      membershipTypeId: null,
      validity: {},
      participations: [],
    },
    delete: {
      pending: false,
    },
    update: {
      pending: false,
    }
  },
  participation: {
    delete: {
      pending: false,
    }
  }
};

export const actions = createActions({
  MEMBERSHIP: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: data => data,
      ERROR: error => error,
    },
    UPDATE: {
      PENDING: undefined,
      SUCCESS: data => data,
      ERROR: error => error,
    },
    DELETE: {
      PENDING: undefined,
      SUCCESS: id => id,
      ERROR: error => error,
    },
    ON_DATA_CHANGED: (path, value) => ({path: path, value: value}),
  },
  MEMBERSHIPS: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: data => data,
      ERROR: error => error,
    }
  },
  CREATE_MEMBERSHIP: {
    SHOW: undefined,
    HIDE: undefined,
    ON_DATA_CHANGED: (path, value) => ({path: path, value: value}),
    SAVE: {
      PENDING: undefined,
      SUCCESS: membership => membership,
      ERROR: error => error
    }
  },
  PARTICIPATIONS: {
    DELETE: {
      PENDING: undefined,
      SUCCESS: id => id,
      ERROR: undefined,
    }
  }
});

export const fetchMembership = (id, force) =>
  (dispatch, getState) => {
    const details = getState().memberships.details;
    if (details.data.id === id && details.lastUpdate && !force) {
      return; // TODO update every other call/day
    }
    dispatch(actions.membership.load.pending());
    return fetchMembershipApiCall(id)
      .then(data => dispatch(actions.membership.load.success(data)))
      .catch(error => dispatch(actions.membership.load.error(error)))
  };

export const deleteMembership = (id, onSuccess) =>
  dispatch => {
    dispatch(actions.membership.delete.pending());
    return deleteMembershipApiCall(id)
      .then(answer => {
        dispatch(actions.membership.delete.success(id));
        dispatch(showNotification(answer.message, 'success'));
        onSuccess();
      })
      .catch(error => {
        dispatch(actions.membership.delete.error());
        dispatch(showNotification(error.message, 'error'));
      });
  };

export const saveMembership = (data, onSuccess) =>
  dispatch => {
    dispatch(actions.membership.update.pending());
    return saveMembershipApiCall(data)
      .then(updated => {
        dispatch(actions.membership.update.success(updated));
        onSuccess();
        dispatch(showNotification('Mitgliedschaft aktualisiert', 'success'));
      })
      .catch(error => {
        dispatch(actions.membership.update.error());
        dispatch(showNotification(error.message, 'error'));
      });
  };

export const fetchMemberships = force =>
  (dispatch, getState) => {
    if (getState().memberships.lastUpdate && !force) {
      return; // TODO update every other call/day
    }
    dispatch(actions.memberships.load.pending());
    return fetchMembershipsApiCall()
      .then(data => dispatch(actions.memberships.load.success(data)))
      .catch(error => dispatch(actions.memberships.load.error(error)))
  };

export const showCreateMembership = () =>
    dispatch => dispatch(actions.createMembership.show());

export const hideCreateMembership = () =>
    dispatch => dispatch(actions.createMembership.hide());

export const onCreateMembershipDataChanged = (path, value) =>
    dispatch => dispatch(actions.createMembership.onDataChanged(path, value));

export const onMembershipDetailsDataChanged = (path, value) =>
  dispatch => dispatch(actions.membership.onDataChanged(path, value));

export const createMembership = data =>
    dispatch => {
      dispatch(actions.createMembership.save.pending());
      return createMembershipApiCall(data)
        .then(membership => {
          dispatch(actions.createMembership.hide());
          dispatch(actions.createMembership.save.success());
          dispatch(showNotification('Mitgliedschaft angelegt', 'success'));
        })
        .catch(error=> dispatch(actions.createMembership.save.error(error.message)));
    };

export const deleteParticipation = (id) =>
  dispatch => {
    dispatch(actions.participations.delete.pending());
    return deleteParticipationApiCall(id)
      .then(answer => {
        dispatch(actions.participations.delete.success(id));
        showNotification(answer.message, 'success')
      })
      .catch(error => {
        dispatch(actions.participations.delete.error());
        showNotification(error.message, 'error')
      })
  };


export default handleActions({
  // get membership
  [actions.membership.load.pending]: state =>
    assignPath(['details'], {pending: true, data: initialState.details.data, error: null}, state),
  [actions.membership.load.success]: (state, {payload}) =>
    assignPath(['details'], {pending: false, data: payload, lastUpdate: moment(), error: null}, state),
  [actions.membership.load.error]: (state, {payload}) =>
    assignPath(['details'], {pending: false, error: payload.message}, state),

  // fetch memberships
  [actions.memberships.load.pending]: state => setPath(['pending'], true, state),
  [actions.memberships.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, lastUpdate: moment(), error: null}, state),
  [actions.memberships.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, error: payload.message}, state),

  // create membership
  [actions.createMembership.show]: state => {
    const nextState = setPath(['create'], initialState.create, state);
    return setPath(['create', 'show'], true, nextState);
  },
  [actions.createMembership.hide]: state => setPath(['create', 'show'], false, state),
  [actions.createMembership.onDataChanged]: (state, {payload}) =>
    setPath(['create', 'data', ...payload.path], payload.value, state),

  [actions.createMembership.save.pending]: state => setPath(['create', 'pending'], true, state),
  [actions.createMembership.save.success]: state =>
    assignPath(['create'], {pending: false, errorMessage: ''}, state),
  [actions.createMembership.save.error]: (state, {payload}) =>
    assignPath(['create'], {pending: false, errorMessage: payload}, state),

  // details
  [actions.membership.onDataChanged]: (state, {payload}) =>
    setPath(['details', 'data', ...payload.path], payload.value, state),

  // update membership
  [actions.membership.update.pending]: state => setPath(['details', 'update', 'pending'], true, state),
  [actions.membership.update.success]: (state, {payload}) => {
    const updatedData = state.data.map(m =>
      m.id === payload.id
        ? payload
        : m);
    const nextState = setPath(['data'], updatedData, state);
    return assignPath(['details', 'update', 'pending'], false, nextState);
  },
  [actions.membership.update.error]: state =>
    assignPath(['details', 'update', 'pending'], false, state),

  // delete membership
  [actions.membership.delete.pending]: state => setPath(['details', 'delete', 'pending'], true, state),
  [actions.membership.delete.success]: (state, {payload}) => {
    const nextState = setPath(['data'], state.data.filter(m => m.id !== payload), state);
    return assignPath(['details', 'delete', 'pending'], false, nextState);
  },
  [actions.membership.delete.error]: state =>
    assignPath(['details', 'delete', 'pending'], false, state),

  // participations
  [actions.participations.delete.pending]: state => setPath(['participation', 'delete', 'pending'], true, state),
  [actions.participations.delete.success]: (state, {payload}) => {
    const nextState = setPath(['details', 'data', 'participations'], state.details.data.participations.filter(p => p.id !== payload), state);
    return assignPath(['participation', 'delete'], {pending: false}, nextState);
  },
  [actions.participations.delete.error]: state =>
    assignPath(['participation', 'delete'], {pending: false}, state),

}, initialState);
