import {
  actions,
  changePassword,
  onOpenPasswordChange,
  onCancelPasswordChange,
  onPasswordChange
} from '../';

// TODO
// jest.mock('../../../service/password');

describe('profile actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => {};
  });

  describe('changePassword', () => {

    it('should dispatch ERROR action when newPassword does not equal newPasswordConfirm', () => {
      changePassword("old", "new", "other new")(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(
        actions.password.error({message: 'Die beiden neuen Passwörter stimmen nicht überein.'}));
    });
  });
});
