import {
  actions,
  changePassword
} from '../';

jest.mock('../../../service/password');

describe('profile actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => {};
  });

  describe('changePassword', () => {

    it('should dispatch ERROR action', async () => {
      const error = new Error('Ops, something went wrong');
      await changePassword(error)(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(actions.password.change.pending());
      expect(dispatchMock.mock.calls[1][0]).toEqual(actions.password.error(error));
    });
  });
});
