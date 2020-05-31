import {CREATE_PLANNER_CALLBACK} from '../actions/constants';

const initialState = {
  plannerCallback: '',
};

const createPlannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PLANNER_CALLBACK: {
      const newState = {
        ...state,
        plannerCallback: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};
export default createPlannerReducer;
