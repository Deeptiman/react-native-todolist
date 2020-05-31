import {FETCH_MICROSOFT_PLANNER} from '../actions/constants';

const initialState = {
  microsoftPlannerList: '',
};

const fetchMicrosoftPlannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MICROSOFT_PLANNER: {
      const newState = {
        ...state,
        microsoftPlannerList: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};
export default fetchMicrosoftPlannerReducer;
