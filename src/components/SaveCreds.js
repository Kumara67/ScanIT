import React from 'react';
import {Modal, Portal} from 'react-native-paper';
import {View, Text, Keyboard} from 'react-native';

export default SaveCreds = (props) => {
  const [visible, setVisible] = React.useState(true);
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
          Do you want to save the credentials?
        </Text>

        <View style={{flexDirection: 'row'}}>
          <Text
            onPress={() => {
              props.saveHandler();
              hideModal;
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
