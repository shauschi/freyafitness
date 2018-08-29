import {fetchMemberships, createMembership} from '../';

describe('membership Service', () => {

  describe('createMembership', () => {
    let apiCall;
    const expectedData = {message: 'success'};

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(expectedData));
    });

    it('should extract response body', async () => {
      const membershipData = {userId: '123', membershipTypeId: '456', validity: {from: '', to: ''}};
      const result = await createMembership(membershipData);

      expect(apiCall).toHaveBeenCalledWith(__API__ + '/memberships/',
        {
          "method": "POST",
          "credentials": "include",
          "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*"
          },
          "body": JSON.stringify(membershipData)
        });
      expect(result).toEqual(expectedData);
    });

    it('should throw an error when fetching courses fails', async () => {
      fetch.mockResponse(JSON.stringify({message: 'Some error'}), {status: 404});

      try {
        await createMembership();
      } catch (err) {
        expect(err.message).toEqual('Some error');
      }
    });
  })

  describe('fetchMemberships', () => {
    let apiCall;
    const expectedData = {message: 'success'};

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(expectedData));
    });

    it('should extract response body', async () => {
      const result = await fetchMemberships();

      expect(apiCall).toHaveBeenCalledWith(__API__ + '/memberships/',
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
        await fetchMemberships();
      } catch (err) {
        expect(err.message).toEqual('Some error');
      }
    });
  })
});
