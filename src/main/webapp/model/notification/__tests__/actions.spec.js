import {fetchNews, actions} from '../';

jest.mock('../../../service/news');

describe('news actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => {};
  });

  describe('fetchNews', () => {

    it('should dispatch PENDING action', () => {
      fetchNews()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(actions.news.load.pending());
    });

    it('should dispatch SUCCESS action when fetch is successful', async () => {
      await fetchNews()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(actions.news.load.success([{id: 'news1'}, {id: 'news2'}]));
    });

    it('should dispatch ERROR action when fetch is not successful', async () => {
      const error = new Error('Ops, something went wrong');
      await fetchNews(error)(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(actions.news.load.error(error));
    })
  });
});
