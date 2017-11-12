import reducer, {actions} from '../';

describe('Job reducer', () => {

  let state;

  beforeEach(() => {
    state = {
      pending: false,
      errorMessage: null,
      list: []
    }
  });

  describe('with PENDING action', () => {

    it('should only set state to pending', () => {
      const nextState = reducer(state, actions.job.load.pending())

      const expectedState = Object.assign({}, state, {pending: true})

      expect(nextState).toEqual(expectedState)
    });
  });

  describe('with SUCCESS action', () => {

    it('should set pending to false and update job list', () => {
      const jobs = ['job1', 'job2']
      const nextState = reducer(state, actions.job.load.success(jobs))

      const expectedState = Object.assign({}, state, {pending: false, list: jobs})

      expect(nextState).toEqual(expectedState)
    });
  });

  describe('with ERROR action', () => {

    it('should set pending to false and update error message', () => {
      const error = new Error('Oops, something went wrong!')
      const nextState = reducer(state, actions.job.load.error(error))

      const expectedState = Object.assign({}, state, {pending: false, errorMessage: error.message})

      expect(nextState).toEqual(expectedState)
    });
  });

});
