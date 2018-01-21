'use strict';
import {GET, POST, PUT} from '../HttpUtils';
import moment from 'moment';
import * as Format from '../../utils/Format.jsx';
const baseURL = __API__;

export const getCourses = () => GET(`${baseURL}/courses/from/${moment().format(Format.ISO_DATE_FORMAT)}`);

export const getCourseDetails = id => GET(`${baseURL}/courses/${id}`);

export const saveCourse = course => POST(`${baseURL}/courses/${course.id}`, course);

export const signIn = id => GET(`${baseURL}/courses/${id}/signin`); // TODO auf PUT umstellen

export const signOut = id => GET(`${baseURL}/courses/${id}/signout`); // TODO auf PUT umstellen