import React, {Component} from 'react';
import {
  BASE64,
  CONFIRM_PASSWORD,
  COUNT,
  IMAGE_ARRAY,
  LAST_CLICKED,
  PATHS_ARRAY,
  RERENDER,
  SELECTED_ITEMS,
  SHOW_MODAL,
  TMP_DATA,
  UPDATE_DEFAULT_PASSWORD,
  UPDATE_PASSWORD,
  UPDATE_USERNAME,
  USER_FOLDER,
} from './actionTypes';

//Action for Login
export const updateUserName = (username) => ({
  type: UPDATE_USERNAME,
  payload: username,
});

export const updatePassword = (password) => ({
  type: UPDATE_PASSWORD,
  payload: password,
});

// Action for ResetPassword
export const updateConfirmPassword = (conPass) => ({
  type: CONFIRM_PASSWORD,
  payload: conPass,
});

export const updateDefaultPassword = (defPass) => ({
  type: UPDATE_DEFAULT_PASSWORD,
  payload: defPass,
});

// Action for CameraScreen
export const updateUserFolder = (folder) => ({
  type: USER_FOLDER,
  payload: folder,
});

export const updateLastClicked = (lastClick) => ({
  type: LAST_CLICKED,
  payload: lastClick,
});

export const updateShowModal = (modal) => ({
  type: SHOW_MODAL,
  payload: modal,
});

export const updateCount = (count) => ({
  type: COUNT,
  payload: count,
});

export const updateTmpData = (tmp) => ({
  type: TMP_DATA,
  payload: tmp,
});

//File, Gallery and Preview actions
export const updatePathsArray = (data) => ({
  type: PATHS_ARRAY,
  payload: data,
});

export const updateSelectedItems = (data) => ({
  type: SELECTED_ITEMS,
  payload: data,
});

export const updateImageArray = (data) => ({
  type: IMAGE_ARRAY,
  payload: data,
});

export const updateBase64 = (data) => ({
  type: BASE64,
  payload: data,
});
