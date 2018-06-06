'use strict';
import {GET, POST, PUT} from '../HttpUtils';
import moment from 'moment';
import * as Format from '../../utils/Format';
const baseURL = __API__;

export const getCourses = () => GET(`${baseURL}/courses/from/${moment().format(Format.ISO_DATE_FORMAT)}`);

export const getCourseDetails = id => GET(`${baseURL}/courses/${id}`);

export const createNewCourse = () => GET(`${baseURL}/courses/create`);

export const saveNewCourse = course => POST(`${baseURL}/courses/create`, course);

export const saveCourse = course => POST(`${baseURL}/courses/${course.id}`, course);

export const signIn = id => PUT(`${baseURL}/courses/${id}/signin`);

export const signOut = id => PUT(`${baseURL}/courses/${id}/signout`);

export const addUserToCourse = (id, userId) => PUT(`${baseURL}/courses/${id}/adduser/${userId}`);

export const removeUserFromCourse = (id, userId) => PUT(`${baseURL}/courses/${id}/removeuser/${userId}`);