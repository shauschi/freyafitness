import {changePassword} from '../';

describe('password service', () => {

  describe('changePassword', () => {
    const changePasswordData = {oldPassword: '12345678', password: '11112222', matchingPassword: '11112222'};
    const mockResponse = {message: 'Your password was changed successfully.'};
    let apiCall;

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(mockResponse));
    });

    it('should extract response body', async () => {
      const result = await changePassword(changePasswordData);
      expect(apiCall).toHaveBeenCalledWith(__API__ + '/password/change',
        {
          "body": JSON.stringify(changePasswordData),
          "credentials": "include",
          "headers": {
            "Accept": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          "method": "POST"
        });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when changing password fails', async () => {
      fetch.mockResponse(JSON.stringify({message: 'Some error'}), {status: 404});

      try {
        await changePassword(changePasswordData);
      } catch (err) {
        expect(err.message).toEqual('Some error');
      }
    });
  })
});
