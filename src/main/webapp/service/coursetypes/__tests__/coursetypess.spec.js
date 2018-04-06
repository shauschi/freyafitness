import {getCourseTypes} from '../';

describe('courses Service', () => {

  describe('getCourseTypes', () => {
    let apiCall;
    const expectedData = [{id: 4711, name: 'Soft'}, {id: 815, name: 'Normal'}];

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(expectedData));
    });

    it('should extract response body', async () => {
      const result = await getCourseTypes();

      expect(apiCall).toHaveBeenCalledWith(__API__ + '/coursetypes/',
        {"credentials": "include", "headers": {"Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Origin": "*"}});
      expect(result).toEqual(expectedData);
    });

    it('should throw an error when fetching courses fails', async () => {
      fetch.mockResponse('', {status: 404});

      try {
        await getCourseTypes();
      } catch (err) {
        expect(err.message).toEqual('Response not ok');
      }
    });
  })
});
