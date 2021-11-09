import {connect} from 'react-redux';
import {
  CONFIRM_PASSWORD,
  UPDATE_DEFAULT_PASSWORD,
  UPDATE_PASSWORD,
  UPDATE_USERNAME,
} from '../actions/actionTypes';

const initialState = {
  userPass: '',
  userName: '',
  defaultPass: 'admin',
  conPass: '',  
};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USERNAME:
      return {
        ...state,
        userName: action.payload,
      };
    case UPDATE_PASSWORD:
      return {
        ...state,
        userPass: action.payload,
      };
    case UPDATE_DEFAULT_PASSWORD:
      return {
        ...state,
        defaultPass: action.payload,
      };
    case CONFIRM_PASSWORD:
      return {
        ...state,
        conPass: action.payload,
      };
    default:
      return state;
  }
};
export default LoginReducer;
