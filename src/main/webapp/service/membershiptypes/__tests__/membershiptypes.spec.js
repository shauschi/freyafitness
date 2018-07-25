import {getMembershipTypes} from '../';

describe('membership Service', () => {

  describe('getMembershipTypes', () => {
    let apiCall;
    const expectedData = [{id: 4711, name: 'Trial'}, {id: 815, name: 'Abo'}];

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(expectedData));
    });

    it('should extract response body', async () => {
      const result = await getMembershipTypes();

      expect(apiCall).toHaveBeenCalledWith(__API__ + '/membershiptypes/',
        {"credentials": "include", "headers": {"Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Origin": "*"}});
      expect(result).toEqual(expectedData);
    });

    it('should throw an error when fetching courses fails', async () => {
      fetch.mockResponse(JSON.stringify({message: 'Some error'}), {status: 404});

      try {
        await getMembershipTypes();
      } catch (err) {
        expect(err.message).toEqual('Some error');
      }
    });
  })
});
