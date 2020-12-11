import React, {Component} from 'react';
import LoginReducer from './reducers/LoginReducer';
import {createStore, combineReducers} from 'redux';
import CameraReducer from './reducers/CameraReducer';
import FileReducer from './reducers/FileReducer';

const rootReducer = combineReducers({
  LoginReducer: LoginReducer,
  CameraReducer: CameraReducer,
  FileReducer: FileReducer,
});
const store = createStore(rootReducer);

export default store;
