import {FETCH_GOOGLE_PLANNER} from '../actions/constants';

const initialState = {
  googlePlannerList: '',
};

const fetchGoogleCalendarReducer = (state = initialState, action) => {
  //console.log("fetchGoogleCalendarReducer -- "+JSON.stringify(action))
  switch (action.type) {
    case FETCH_GOOGLE_PLANNER: {
      //console.log("fetchGoogleCalendarReducer -- FETCH_GOOGLE_PLANNER :: "+JSON.stringify(action.payload))
      const newState = {
        ...state,
        googlePlannerList: action.payload,
      };
      //console.log("fetchGoogleCalendarReducer -- FETCH_GOOGLE_PLANNER :: newState ==>> "+JSON.stringify(newState))
      
      return newState;
    }
    default:
      return state;
  }
};
export default fetchGoogleCalendarReducer;
