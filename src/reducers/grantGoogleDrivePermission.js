import {GRANT_GOOGLE_DRIVE_PERMISSION} from '../actions/constants';

const initialState = {
  grantDrivePermissionState: '',
};

const grantGoogleDrivePermissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GRANT_GOOGLE_DRIVE_PERMISSION: {
      const newState = {
        ...state,
        grantDrivePermissionState: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};
export default grantGoogleDrivePermissionReducer;
