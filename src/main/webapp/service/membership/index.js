'use strict';
import {POST} from '../HttpUtils';
const baseURL = __API__;

export const createMembership = createMembershipData => POST(`${baseURL}/memberships/`, createMembershipData);
