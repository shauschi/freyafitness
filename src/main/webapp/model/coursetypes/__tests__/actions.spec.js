import {fetchCourseTypes, actions} from '../';

jest.mock('../../../service/coursetypes');

describe('coursetypes actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => {};
  });

  describe('fetchCourseTypes', () => {

    it('should dispatch PENDING action', () => {
      fetchCourseTypes()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(
        actions.courseTypes.load.pending());
    });

    it('should dispatch SUCCESS action when fetch is successful', async () => {
      await fetchCourseTypes()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(
        actions.courseTypes.load.success([{id: 4711, name: 'Soft'}, {id: 815, name: 'Normal'}]));
    });

    it('should dispatch ERROR action when fetch is not successful', async () => {
      const error = new Error('Ops, something went wrong');
      await fetchCourseTypes(error)(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(
        actions.courseTypes.load.error(error));
    })
  });
});
