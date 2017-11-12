import {fetchJobList, actions} from '../';

jest.mock('../../../service/job');

describe('job actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => {};
  });

  describe('fetchJobList', () => {

    it('should dispatch PENDING action', () => {
      fetchJobList()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(actions.job.load.pending());
    });

    it('should dispatch SUCCESS action when fetch is successful', async () => {
      await fetchJobList()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(actions.job.load.success(['job1', 'job2']));
    });

    it('should dispatch ERROR action when fetch is not successful', async () => {
      const error = new Error('Ops, something went wrong');
      await fetchJobList(error)(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(actions.job.load.error(error));
    })
  });
});
