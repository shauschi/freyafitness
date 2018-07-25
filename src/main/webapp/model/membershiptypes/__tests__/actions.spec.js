import {fetchMembershipTypes, actions} from '../';

jest.mock('../../../service/membershiptypes');

describe('membershiptypes actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => {};
  });

  describe('fetchMembershipTypes', () => {

    it('should dispatch PENDING action', () => {
      fetchMembershipTypes()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(
        actions.membershipTypes.load.pending());
    });

    it('should dispatch SUCCESS action when fetch is successful', async () => {
      await fetchMembershipTypes()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(
        actions.membershipTypes.load.success([{id: 4711, name: 'Trial'}, {id: 815, name: 'Abo'}]));
    });

    it('should dispatch ERROR action when fetch is not successful', async () => {
      const error = new Error('Ops, something went wrong');
      await fetchMembershipTypes(error)(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(
        actions.membershipTypes.load.error(error));
    })
  });
});
