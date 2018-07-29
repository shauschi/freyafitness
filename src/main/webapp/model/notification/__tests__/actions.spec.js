import {showNotification, hideNotification, actions} from '../';

describe('notification actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => {};
  });

  describe('notifications actions', () => {

    it('should dispatch SHOW action', () => {
      showNotification('Test message')(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(
        actions.notification.show({message: 'Test message', type: undefined, autoHideDuration: 5500}));
    });

    it('should dispatch HIDE action', async () => {
      hideNotification()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(actions.notification.hide());
    });

  });
});
