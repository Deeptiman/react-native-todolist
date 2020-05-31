import {FETCH_STUDENTS_LIST} from '../actions/constants';

const initialState = {
  studentsList: '',
};

const fetchStudentsListReducer = (state = initialState, action) => {
  switch (action.type) {    
    case FETCH_STUDENTS_LIST: {
      const newState = {
        ...state,
        studentsList: action.payload,
      };
      return newState;
    }
    default:
      return state;
  }
};
export default fetchStudentsListReducer;
