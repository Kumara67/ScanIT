import React, {Component, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Appbar} from 'react-native-paper';
import * as RNFS from 'react-native-fs';
import SaveAsModal from './saveAs';
import {
  updateCount,
  updateLastClicked,
  updateSelectedItems,
  updateShowModal,
  updateTmpData,
  updateUserFolder,
} from '../actions/actionDefs';
import {connect} from 'react-redux';
import DBThings from './DBThings';

const dbTransactions = new DBThings();
const CameraScreen = (props) => {
  var cameraRef = React.useRef(null);
  // const {count, lastClicked, showModal, tmpData, userFolder} = props;
  // const [count, setCount] = useState(0);
  // const [lastClicked, setLastClicked] = useState('');
  // const [userFolder, setUserFolder] = useState('');
  // const [showModal, setShowModal] = useState(false);
  // const [tmpData, setTempData] = useState(null);
  useEffect(() => {
    const {params} = props.route;
    if (
      params !== undefined &&
      params !== null &&
      params.hasOwnProperty('folderName')
    ) {
      props.updateUserFolder(props.route.params.folderName);
    }
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      props.updateTmpData(data.base64);
      if (props.userFolder === '') {
        props.updateShowModal(true);
      } else {
        saveFileAs(props.userFolder, data.base64);
      }
    }
  };

  const saveFileAs = async (docName, data = props.tmpData) => {
    try {
      const dirName = `${RNFS.ExternalDirectoryPath}/${docName}`;
      const dirExists = await RNFS.exists(dirName);
      if (!dirExists) {
        await dbTransactions.insertDOCQuery(docName, dirName, getTimeStamp());
        await RNFS.mkdir(dirName);
      }
      const path = `${dirName}/${docName}_${getTimeStamp()}.jpg`;
      await RNFS.writeFile(path, data, 'base64');
      console.log('FILE WRITTEN!');
      await dbTransactions.insertFileQuery(
        `${docName}_${getTimeStamp()}.jpg`,
        path,
        docName,
        getTimeStamp(),
      );
      props.updateLastClicked(path);
      props.updateCount(props.count + 1);
      props.updateTmpData('');
      // setLastClicked(path)
    } catch (error) {
      console.log(error.message);
    }
  };

  function getTimeStamp() {
    var date = new Date();
    let comps = [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ];
    let dateString = comps.join('');
    return dateString;
  }
  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            props.navigation.goBack();
            props.updateUserFolder('');
            props.updateLastClicked('');
            props.updateSelectedItems([]);
          }}
        />
        <Appbar.Content title="Capture" />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
      {props.showModal && (
        <SaveAsModal
          saveHandler={(value) => {
            props.updateUserFolder(value);
            console.log(`>> save: ${props.userFolder}`);
            saveFileAs(value);
          }}
        />
      )}

      <RNCamera style={{flex: 1}} ref={cameraRef}></RNCamera>
      <View
        style={{
          flexDirection: 'row',
          flex: 0.1,
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          onPress={() => takePicture()}
          style={{
            padding: 10,
            borderWidth: 5,
            borderColor: 'grey',
            borderRadius: 50,
          }}>
          <Image
            style={{
              height: 40,
              width: 40,
              resizeMode: 'contain',
            }}
            source={require('../icons/photo-camera.png')}
          />
        </TouchableOpacity>
        {props.lastClicked === '' ? null : (
          <TouchableOpacity
            style={{
              height: 50,
              width: 50,
              position: 'absolute',
              right: 25,
            }}
            onPress={() => {
              // var imagePath = path;
              props.updateLastClicked('');
              props.navigation.navigate('Gallery', {
                folderName: props.userFolder,
              });
              props.updateCount(0);
            }}>
            <Image
              source={{uri: `file://${props.lastClicked}`}}
              style={{height: 60, width: 60}}
            />

            {props.count === 0 ? null : (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  justifyContent: 'flex-start',
                  alignSelf: 'flex-end',
                  backgroundColor: 'crimson',
                  borderRadius: 7,
                  height: 18,
                  width: 18,
                  position: 'absolute',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  top: -10,
                  right: -10,
                }}>
                {props.count}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    count: state.CameraReducer.count,
    showModal: state.CameraReducer.showModal,
    lastClicked: state.CameraReducer.lastClicked,
    tmpData: state.CameraReducer.tmpData,
    userFolder: state.CameraReducer.userFolder,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCount: (count) => dispatch(updateCount(count)),
    updateShowModal: (modal) => dispatch(updateShowModal(modal)),
    updateLastClicked: (lastClick) => dispatch(updateLastClicked(lastClick)),
    updateTmpData: (tmpData) => dispatch(updateTmpData(tmpData)),
    updateUserFolder: (userFolder) => dispatch(updateUserFolder(userFolder)),
    updateSelectedItems: (data) => dispatch(updateSelectedItems(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);
