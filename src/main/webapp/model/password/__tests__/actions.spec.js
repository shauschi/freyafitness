import {fetchOwnProfile, actions} from '../';

jest.mock('../../../service/profile');

describe('profile actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => {};
  });

  describe('fetchOwnProfile', () => {

    it('should dispatch PENDING action', () => {
      fetchOwnProfile()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(actions.profile.load.pending());
    });

    it('should dispatch SUCCESS action when fetch is successful', async () => {
      await fetchOwnProfile()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(actions.profile.load.success({"firstname": "Testee", "lastname": "Foobar"}));
    });

    it('should dispatch ERROR action when fetch is not successful', async () => {
      const error = new Error('Ops, something went wrong');
      await fetchOwnProfile(error)(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(actions.profile.load.error(error));
    })
  });
});
