import {FETCH_FIREBASE_PLANNER} from '../actions/constants';

const initialState = {
  firebasePlannerList: '',
};

const fetchFirebaseCalendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FIREBASE_PLANNER: {
      const newState = {
        ...state,
        firebasePlannerList: action.payload,
      };      
      return newState;
    }
    default:
      return state;
  }
};
export default fetchFirebaseCalendarReducer;
