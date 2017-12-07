'use strict';
import {GET} from '../HttpUtils';
import moment from 'moment';
const baseURL = __API__;

export const getCourses = () => GET(`${baseURL}/courses/${moment().format('YYYY-MM-DD')}`);

