'use strict';
import {DELETE} from '../HttpUtils';
const baseURL = __API__;

export const deleteParticipation = id => DELETE(`${baseURL}/participations/${id}`);
