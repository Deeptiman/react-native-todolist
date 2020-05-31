import {ADD_PLANNER} from '../actions/constants';

const initialState = {
  addPlannerPayload: '',
};

const addPlannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLANNER: {
      const newState = {
        ...state,
        addPlannerPayload: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};
export default addPlannerReducer;
