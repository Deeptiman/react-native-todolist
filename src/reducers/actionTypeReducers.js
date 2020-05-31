import {ACTION_TYPE} from '../actions/constants';

const initialState = {
  actionType: '',
};

const actionTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE: {
      const newState = {
        ...state,
        actionType: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};

export default actionTypeReducer;
