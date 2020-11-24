import React, {Component, useState} from 'react';
import {Modal, Portal} from 'react-native-paper';
import {View, Text, TextInput, TouchableOpacity, Keyboard} from 'react-native';

const SaveAsModal = (props) => {
  const [visible, setVisible] = useState(true);
  const [folderName, setFolderName] = useState('');
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
          onChangeText={(text) => setFolderName(text)}
        />
        <View style={{flexDirection: 'row'}}>
          <Text
            onPress={() => {
              Keyboard.dismiss();
              props.saveHandler(folderName);
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

export default SaveAsModal;
