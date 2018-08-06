import {fetchStatistics, actions} from '../';

jest.mock('../../../service/statistics');

describe('statistics actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => ({statistics: {}});
  });

  describe('fetchStatistics', () => {

    it('should dispatch PENDING action', () => {
      fetchStatistics('1234')(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(
        actions.statistics.load.pending());
    });

    it('should dispatch SUCCESS action when fetch is successful', async () => {
      await fetchStatistics('1234')(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(
        actions.statistics.load.success({userId: "1234"}));
    });

    it('should dispatch ERROR action when fetch is not successful', async () => {
      const error = new Error('Ops, something went wrong');
      await fetchStatistics(error)(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(
        actions.statistics.load.error(error));
    })
  });
});
