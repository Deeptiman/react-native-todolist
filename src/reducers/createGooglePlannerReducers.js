import {CREATE_GOOGLE_PLANNER} from '../actions/constants';

const initialState = {
  createGooglePlannerPayload: '',
};

const createGooglePlannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GOOGLE_PLANNER: {
      const newState = {
        ...state,
        createGooglePlannerPayload: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};
export default createGooglePlannerReducer;
