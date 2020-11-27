import React from 'react';
import {
  COUNT,
  LAST_CLICKED,
  SHOW_MODAL,
  TMP_DATA,
  USER_FOLDER,
} from '../actions/actionTypes';

const initialState = {
  userFolder: '',
  count: 0,
  lastClicked: '',
  tmpData: null,
  showModal: false,
};

const CameraReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_FOLDER:
      return {
        ...state,
        userFolder: action.payload,
      };
    case LAST_CLICKED:
      return {
        ...state,
        lastClicked: action.payload,
      };
    case COUNT:
      return {
        ...state,
        count: action.payload,
      };
    case TMP_DATA:
      return {
        ...state,
        tmpData: action.payload,
      };
    case SHOW_MODAL:
      return {
        ...state,
        showModal: action.payload,
      };
    default:
      return state;
  }
};

export default CameraReducer;
