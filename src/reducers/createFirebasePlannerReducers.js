import {CREATE_FIREBASE_PLANNER} from '../actions/constants';

const initialState = {
  createFirebasePlannerPayload: '',
};

const createFirebasePlannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_FIREBASE_PLANNER: {
      const newState = {
        ...state,
        createFirebasePlannerPayload: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};
export default createFirebasePlannerReducer;
