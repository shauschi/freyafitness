'use strict';
import {POST} from '../HttpUtils';
const baseURL = __API__;

export const updatePreference = preferenceData => POST(`${baseURL}/preferences/`, preferenceData);
