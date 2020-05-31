import {CREATE_MICROSOFT_PLANNER} from '../actions/constants';

const initialState = {
  createMicrosoftPlanner: '',
};

const createMicrosoftPlannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_MICROSOFT_PLANNER: {
      const newState = {
        ...state,
        createMicrosoftPlanner: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};
export default createMicrosoftPlannerReducer;
