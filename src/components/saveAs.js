import React, {Component, useState} from 'react';
import {Modal, Portal} from 'react-native-paper';
import {View, Text, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import {updateShowModal, updateUserFolder} from '../actions/actionDefs';

const SaveAsModal = (props) => {
  const [newFolder, setNewFolder] = useState('');
  const [visible, setVisible] = useState(true);
  const hideModal = () => setVisible(false);
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={{
          backgroundColor: 'white',
          margin: 20,
          alignItems: 'center',
          borderRadius: 10,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            width: '100%',
            marginVertical: 10,
            textAlign: 'center',
          }}>
          Enter New Folder Name
        </Text>
        <TextInput
          style={{
            borderBottomWidth: 2,
            borderColor: 'purple',
            width: '100%',
            fontSize: 30,
          }}
          placeholder="FolderName"
          onChangeText={(text) => setNewFolder(text)}
        />
        <View style={{flexDirection: 'row'}}>
          <Text
            onPress={() => {
              Keyboard.dismiss();
              props.updateShowModal(false);
              props.saveHandler(newFolder);
              hideModal();
            }}
            style={{
              backgroundColor: 'purple',
              fontSize: 20,
              color: 'white',
              padding: 10,
              borderRadius: 15,
              width: 100,
              textAlign: 'center',
              margin: 20,
            }}>
            Save
          </Text>
          <Text
            onPress={() => {
              props.updateShowModal(false);
              hideModal();
            }}
            style={{
              backgroundColor: 'purple',
              fontSize: 20,
              color: 'white',
              padding: 10,
              borderRadius: 15,
              width: 100,
              textAlign: 'center',
              margin: 20,
            }}>
            Cancel
          </Text>
        </View>
      </Modal>
    </Portal>
  );
};
const mapStateToProps = (state) => {
  return {
    userFolder: state.CameraReducer.userFolder,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateUserFolder: (folder) => dispatch(updateUserFolder(folder)),
    updateShowModal: (modal) => dispatch(updateShowModal(modal)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SaveAsModal);
