import {getProfile} from '../';

describe('profile Service', () => {

  describe('getProfile', () => {
    const profile = {firstname: 'Testee', lastname: 'Foobar'};
    let apiCall;

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(profile));
    });

    it('should extract response body', async () => {
      const result = await getProfile(123456);
      expect(apiCall).toHaveBeenCalledWith(__API__ + '/profile/123456');
      expect(result).toEqual(profile);
    });

    it('should throw an error when fetching profile fails', async () => {
      fetch.mockResponse('', {status: 404});

      try {
        await getProfile();
      } catch (err) {
        expect(err.message).toEqual('Response not ok');
      }
    });
  })
});
