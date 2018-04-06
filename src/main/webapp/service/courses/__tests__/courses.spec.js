import {getCourses} from '../';
import moment from 'moment';
import * as Format from "../../../utils/Format";

describe('courses Service', () => {

  describe('getCourses', () => {
    const courses = [
      {id: 1234, courseType: 'Soft', instructor: 'Freya'},
      {id: 1235, courseType: 'Soft', instructor: 'Freya'}
    ];
    let apiCall;

    beforeEach(() => {
      fetch.resetMocks();
      apiCall = fetch.mockResponse(JSON.stringify(courses));
    });

    it('should extract response body', async () => {
      const result = await getCourses();
      expect(apiCall).toHaveBeenCalledWith(
        __API__ + '/courses/from/' + moment().format(Format.ISO_DATE_FORMAT),
        {"credentials": "include", "headers": {"Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Origin": "*"}});
      expect(result).toEqual(courses);
    });

    it('should throw an error when fetching courses fails', async () => {
      fetch.mockResponse('', {status: 404});

      try {
        await getCourses();
      } catch (err) {
        expect(err.message).toEqual('Response not ok');
      }
    });
  })
});
