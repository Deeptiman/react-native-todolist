import {UPLOAD_FILES_GOOGLE_DRIVE} from '../actions/constants';

const initialState = {
  uploadDriveAttachment: '',
};

const uploadFilesGoogleDriveReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_FILES_GOOGLE_DRIVE: {
      const newState = {
        ...state,
        uploadDriveAttachment: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};
export default uploadFilesGoogleDriveReducer;
