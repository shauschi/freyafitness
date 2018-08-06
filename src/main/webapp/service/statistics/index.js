'use strict';
import {GET} from '../HttpUtils';
const baseURL = __API__;

export const getStatistics = userId => GET(`${baseURL}/statistics/${userId}`);
