'use strict';
import {GET} from '../HttpUtils';
const baseURL = __API__;

export const getMembershipTypes = () => GET(`${baseURL}/membershiptypes/`);
