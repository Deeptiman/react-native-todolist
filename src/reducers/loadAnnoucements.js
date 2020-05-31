import {FETCH_FIREBASE_ANNOUNCEMENT} from '../actions/constants';

const initialState = {
  loadFBAnnoucements: '',  
};

const fetchFBAnnouncementReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FIREBASE_ANNOUNCEMENT: {
      const newState = {
        ...state,
        loadFBAnnoucements: action.payload,        
      };
      return newState;
    }
    default:
      return state;
  }
};
export default fetchFBAnnouncementReducer;
