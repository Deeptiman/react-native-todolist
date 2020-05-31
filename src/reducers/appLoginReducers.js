import {APP_LOGIN} from '../actions/constants';

const initialState = {
  appLoginPayload: '',
};

const appLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case APP_LOGIN: {
      const newState = {
        ...state,
        appLoginPayload: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};
export default appLoginReducer;
