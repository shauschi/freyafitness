'use strict';
import {GET} from '../HttpUtils';
const baseURL = __API__;

export const getCourses = () => GET(`${baseURL}/courses/`);
