import {fetchCourses, actions} from '../';

jest.mock('../../../service/courses');

describe('courses actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => {};
  });

  describe('fetchCourses', () => {

    it('should dispatch PENDING action', () => {
      fetchCourses()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[0][0]).toEqual(actions.courses.load.pending());
    });

    it('should dispatch SUCCESS action when fetch is successful', async () => {
      await fetchCourses()(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(actions.courses.load.success({id: 4711, instructor: 'Freya'}));
    });

    it('should dispatch ERROR action when fetch is not successful', async () => {
      const error = new Error('Ops, something went wrong');
      await fetchCourses(error)(dispatchMock, getMockState);

      expect(dispatchMock.mock.calls[1][0]).toEqual(actions.courses.load.error(error));
    })
  });
});
