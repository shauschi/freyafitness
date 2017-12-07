'use strict';
import {GET} from '../HttpUtils';
import moment from 'moment';
const baseURL = __API__;

export const getCourses = () => GET(`${baseURL}/courses/from/${moment().format('YYYY-MM-DD')}`);

export const getCourseDetails = id => GET(`${baseURL}/courses/${id}`);
