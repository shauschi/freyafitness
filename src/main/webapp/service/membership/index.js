'use strict';
import {GET, POST, DELETE} from '../HttpUtils';
const baseURL = __API__;

export const fetchMemberships = () => GET(`${baseURL}/memberships/`);
export const createMembership = createMembershipData => POST(`${baseURL}/memberships/`, createMembershipData);
export const fetchMembership = id => GET(`${baseURL}/memberships/${id}`);
export const saveMembership = membershipData => POST(`${baseURL}/memberships/${membershipData.id}`, membershipData);
export const deleteMembership = id => DELETE(`${baseURL}/memberships/${id}`);
