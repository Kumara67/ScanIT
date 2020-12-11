import React, {Component, useState} from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import * as RNFS from 'react-native-fs';
import {Appbar} from 'react-native-paper';
import Share from 'react-native-share';
import {connect} from 'react-redux';
import {updateBase64} from '../actions/actionDefs';

const Preview = (props) => {
  // const [base64, setBase64] = useState('');
  var currImagePath = props.route.params.path;
  let imageName = currImagePath.slice(
    currImagePath.lastIndexOf('/') + 1,
    currImagePath.length,
  );

  const _onShare = async () => {
    RNFS.readFile(`file://${currImagePath}`, 'base64')
      .then((res) => 
      // setBase64(res)
      props.updateBase64(res)
      )
      .catch((err) => console.log(err));
    try {
      await Share.open({
        url: 'data:image/jpg;base64,' + props.base64,
        message: imageName,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const _onDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete??', [
      {
        text: 'Delete',
        onPress: async () => {
          await RNFS.unlink(currImagePath);
          Alert.alert('Successfully Deleted');
          props.navigation.goBack();
        },
      },
      {text: 'Cancel', onPress: () => false},
    ]);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Appbar.Content title={imageName} />

        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
      <View style={{flex: 1}}>
        <Image
          style={{
            width: '100%',
            resizeMode: 'contain',
            height: '100%',
          }}
          source={{uri: `file://${currImagePath}`}}
        />
      </View>
      <View
        style={{
          flex: 0.08,
          backgroundColor: 'black',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity style={{backgroundColor: 'purple', borderRadius: 15}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              textAlign: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
              width: 150,
              fontWeight: 'bold',
            }}
            onPress={()=> _onShare()}>
            SHARE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor: 'purple', borderRadius: 15}}
          onPress={()=> _onDelete()}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              textAlign: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
              width: 150,
              fontWeight: 'bold',
            }}>
            DELETE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    base64: state.FileReducer.base64,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateBase64: (data) => dispatch(updateBase64(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
