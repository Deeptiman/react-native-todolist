import {FETCH_PLANNERS} from '../actions/constants';

const initialState = {
  plannerList: '',
  eventsList: '',
};

const fetchUserReducer = (state = initialState, action) => {
  console.log("Fetch Reducers Planner --> "+action.events)
  switch (action.type) {
    case FETCH_PLANNERS: {
      const newState = {
        ...state,
        plannerList: action.payload,
        eventsList: action.events
      };
      return newState;
    }
    default:
      return state;
  }
};
export default fetchUserReducer;
