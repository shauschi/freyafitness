'use strict';
import {sendContact} from '../';

describe('contact service', () => {

  describe('sendContact', () => {
    const mockResult = {message: 'foo'};
    let apiCall;

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(mockResult));
    });

    it('should extract response body', async () => {
      const result = await sendContact({firstname: 'testee', subject: 'subject', message: 'some long message'});
      expect(apiCall).toHaveBeenCalledWith(__API__ + '/contact/',
        {
          "method": "POST",
          "credentials": "include",
          "headers": {"Accept": "application/json", "Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
          "body": "{\"firstname\":\"testee\",\"subject\":\"subject\",\"message\":\"some long message\"}"
        });
      expect(result).toEqual(result);
    });

    it('should throw an error when sending contact fails', async () => {
      fetch.mockResponse(JSON.stringify({message: 'Some error'}), {status: 404});

      try {
        await sendContact({firstname: 'testee', subject: 'subject', message: 'some long message'});
      } catch (err) {
        expect(err.message).toEqual('Some error');
      }
    });
  })
});
