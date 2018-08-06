import {getStatistics} from '../';

describe('statistics Service', () => {

  describe('getStatistics', () => {
    let apiCall;
    const expectedData = {userId: '1234'};

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(expectedData));
    });

    it('should extract response body', async () => {
      const result = await getStatistics('1234');

      expect(apiCall).toHaveBeenCalledWith(__API__ + '/statistics/1234',
        {
          "credentials": "include",
          "headers": {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*"
          }
        });
      expect(result).toEqual(expectedData);
    });

    it('should throw an error when fetching courses fails', async () => {
      fetch.mockResponse(JSON.stringify({message: 'Some error'}), {status: 404});

      try {
        await getStatistics();
      } catch (err) {
        expect(err.message).toEqual('Some error');
      }
    });
  })
});
