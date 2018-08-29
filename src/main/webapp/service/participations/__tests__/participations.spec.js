import {deleteParticipation} from '../';

describe('participation Service', () => {

  describe('deleteParticipation', () => {
    let apiCall;
    const expectedData = {message: 'gelöscht'};

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(expectedData));
    });

    it('should extract response body', async () => {
      const result = await deleteParticipation('id');

      expect(apiCall).toHaveBeenCalledWith(__API__ + '/participations/id',
        {
          "method": "DELETE",
          "credentials": "include",
          "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*"
          }
        });
      expect(result).toEqual(expectedData);
    });

    it('should throw an error when fetching courses fails', async () => {
      fetch.mockResponse(JSON.stringify({message: 'Some error'}), {status: 404});

      try {
        await deleteParticipation();
      } catch (err) {
        expect(err.message).toEqual('Some error');
      }
    });
  });

});
