'use strict';
import {GET, PUT} from '../HttpUtils';
import moment from 'moment';
const baseURL = __API__;

export const getCourses = () => GET(`${baseURL}/courses/from/${moment().format('YYYY-MM-DD')}`);

export const getCourseDetails = id => GET(`${baseURL}/courses/${id}`);

export const signIn = id => GET(`${baseURL}/courses/${id}/signin`); // TODO auf PUT umstellen

export const signOut = id => GET(`${baseURL}/courses/${id}/signout`); // TODO auf PUT umstellen