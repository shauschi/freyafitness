import {updatePreference} from '../';

describe('preferences Service', () => {

  describe('createMembership', () => {
    let apiCall;
    const expectedData = {message: 'success'};

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(expectedData));
    });

    it('should extract response body', async () => {
      const preferenceData = {userId: '123', key: 'some', value: 'any', validity: {from: '', to: ''}};
      const result = await updatePreference(preferenceData);

      expect(apiCall).toHaveBeenCalledWith(__API__ + '/preferences/',
        {
          "method": "POST",
          "credentials": "include",
          "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*"
          },
          "body": JSON.stringify(preferenceData)
        });
      expect(result).toEqual(expectedData);
    });

    it('should throw an error when fetching courses fails', async () => {
      fetch.mockResponse(JSON.stringify({message: 'Some error'}), {status: 404});

      try {
        await updatePreference();
      } catch (err) {
        expect(err.message).toEqual('Some error');
      }
    });
  })
});
