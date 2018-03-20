'use strict';
import {GET, POST, POST_IMAGE} from '../HttpUtils';
const baseURL = __API__;

export const getProfile = id => GET(`${baseURL}/profile/${id}`);

export const getOwnProfile = () => GET(`${baseURL}/profile/own`);

export const getProfilePicture = id => GET(`${baseURL}/profile/${id}picture`);

export const changeProfilePicture = image =>
  POST_IMAGE(`${baseURL}/profile/picture/change`, image);

export const loginWithFacebook  = () => POST(`${baseURL}/loginwithfacebook`);

export const logout = () => POST(`${baseURL}/logout`);