import React, {Component, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Appbar, Modal} from 'react-native-paper';
import * as RNFS from 'react-native-fs';
import SaveAsModal from './saveAs';

export default CameraScreen = (props) => {
  var cameraRef = React.useRef(null);
  const [clickedItems, setClickedItems] = useState([]);
  const [count, setCount] = useState(0);
  const [lastClicked, setLastClicked] = useState('');
  const [userFolder, setUserFolder] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tmpData, setTempData] = useState(null);
  useEffect(() => {
    const {params} = props.route;
    if (
      params !== undefined &&
      params !== null &&
      params.hasOwnProperty('folderName')
    ) {
      setUserFolder(props.route.params.folderName);
    }
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      setTempData(data.base64);
      if (userFolder === '') {
        setShowModal(true);
      } else {
        saveFileAs(userFolder, data.base64);
      }
    }
  };

  const saveFileAs = async (docName, data = tmpData) => {
    const nItems = clickedItems;
    try {
      const dirName = `${RNFS.ExternalDirectoryPath}/${docName}`;
      const dirExists = await RNFS.exists(dirName);
      if (!dirExists) {
        await RNFS.mkdir(dirName);
      }
      const path = `${dirName}/ScanIt-${getTimeStamp()}.jpg`;
      await RNFS.writeFile(path, data, 'base64');
      console.log('FILE WRITTEN!');
      //nItems.push(data.base64);
      //setClickedItems(nItems);
      setCount(count + 1);
      setLastClicked(path);
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
      date.getMilliseconds(),
    ];
    let dateString = comps.join('');
    return dateString;
  }
  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Appbar.Content title="Capture" />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
      {showModal && (
        <SaveAsModal
          saveHandler={(value) => {
            setUserFolder(value);
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
        {lastClicked === '' ? null : (
          <TouchableOpacity
            style={{
              height: 50,
              width: 50,
              position: 'absolute',
              right: 25,
            }}
            onPress={() => {
              // var imagePath = path;
              props.navigation.navigate('Gallery', {
                folderName: userFolder,
              });
              setCount(0);
            }}>
            <Image
              source={{uri: `file://${lastClicked}`}}
              style={{height: 50, width: 50}}
            />

            {count === 0 ? null : (
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
                {count}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
