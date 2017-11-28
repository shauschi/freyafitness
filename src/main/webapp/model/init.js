import {fetchProfile} from './profile';

export default (dispatch) => {
  dispatch(fetchProfile(10 /* TODO ID setzen */));
}
