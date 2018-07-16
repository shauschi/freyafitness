import {sendContact, actions} from '../';

jest.mock('../../../service/contact');

describe('contact actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => {};
  });

  describe('fetchNews', () => {

    it('should dispatch PENDING action', () => {
      sendContact()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(actions.contact.send.pending());
    });

    it('should dispatch SUCCESS action when fetch is successful', async () => {
      await sendContact()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(actions.contact.send.success({message: 'success'}));
    });

    it('should dispatch ERROR action when fetch is not successful', async () => {
      const error = new Error('Ops, something went wrong');
      await sendContact(error)(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(actions.contact.send.error(error));
    })
  });
});
