'use strict';
import {GET} from '../HttpUtils';
const baseURL = __API__;

export const getCourseTypes = () => GET(`${baseURL}/coursetypes/`);
