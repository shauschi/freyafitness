'use strict';
import {POST} from '../HttpUtils';
const baseURL = __API__;

export const changePassword = data => POST(`${baseURL}/password/change`, data);
