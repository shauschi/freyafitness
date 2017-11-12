import {getProfil} from '../';

describe('profile Service', () => {

  describe('getJobList', () => {
    const profile = {firstname: 'Testee', lastname: 'Foobar'};
    let apiCall;

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(profile));
    });

    it('should extract response body', async () => {
      const result = await getProfil();
      expect(apiCall).toHaveBeenCalledWith('http://127.0.0.1:8080/profile');
      expect(result).toEqual(profile);
    });

    it('should throw an error when fetching profile fails', async () => {
      fetch.mockResponse('', {status: 404});

      try {
        await getProfil()
      } catch (err) {
        expect(err.message).toEqual('Response not ok');
      }
    });
  })
});
