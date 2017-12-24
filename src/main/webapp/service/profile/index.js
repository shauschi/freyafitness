'use strict';
import {GET} from '../HttpUtils';
const baseURL = __API__;

export const getProfile = id => GET(`${baseURL}/profile/${id}`);

export const getOwnProfile = () => GET(`${baseURL}/profile/own`);
