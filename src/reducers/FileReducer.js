const {
  PATHS_ARRAY,
  SELECTED_ITEMS,
  RERENDER,
  IMAGE_ARRAY,
  BASE64,
} = require('../actions/actionTypes');

const initialState = {
  pathsArray: [],
  selectedItems: [],
  imageArray: [],
  base64: '',
};

const FileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PATHS_ARRAY:
      return {
        ...state,
        pathsArray: action.payload,
      };
    case SELECTED_ITEMS:
      return {
        ...state,
        selectedItems: action.payload,
      };
    case RERENDER:
      return {
        ...state,
        reRender: action.payload,
      };
    case IMAGE_ARRAY:
      return {
        ...state,
        imageArray: action.payload,
      };
    case BASE64:
      return {
        ...state,
        base64: action.payload,
      };
    default:
      return state;
  }
};

export default FileReducer;
