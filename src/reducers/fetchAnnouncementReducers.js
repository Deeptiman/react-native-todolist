import {FETCH_ANNOUNCEMENT} from '../actions/constants';

const initialState = {
  announcementList: '',
};

const fetchAnnouncementReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ANNOUNCEMENT: {
      const newState = {
        ...state,
        announcementList: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};
export default fetchAnnouncementReducer;
