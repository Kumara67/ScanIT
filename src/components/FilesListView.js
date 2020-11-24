import React, {Component, useEffect, useState} from 'react';
import {Appbar, Avatar} from 'react-native-paper';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as RNFS from 'react-native-fs';
import Share from 'react-native-share';

export default FileListView = (props) => {
  const [pathsArray, setPathsArray] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [rerender, forceRerender] = useState('someKey');
  const [logout, setLogout] = useState(true);

  useEffect(() => {
    // Subscribe for the focus Listener
    const unsubscribe = props.navigation.addListener('focus', () => {
      readDirectory();
    });
    return () => {
      // Unsubscribe for the focus Listener
      unsubscribe;
    };
  }, [props.navigation]);

  const readDirectory = async () => {
    let res = await RNFS.readdir(RNFS.ExternalDirectoryPath);
    var count = 0;
    var results = [];
    res.forEach((item) => {
      results.push({
        key: (count + 1).toString(),
        path: RNFS.ExternalDirectoryPath + '/' + item,
        folder: item,
      });
      count = count + 1;
      if (count === res.length) {
        setPathsArray(results);
      }
    });
  };

  const _onShare = async () => {
    try {
      //console.log('Called onShare');
      //return;
      var urls = [];
      var count = 0;
      const length = selectedItems.length;
      selectedItems.forEach(async (item) => {
        const res = await RNFS.readFile(`file://${item.path}`, 'base64'); //1
        urls.push('data:image/jpg;base64,' + res);
        count = count + 1;
        if (count === length) {
          try {
            const options = {
              title: 'Hello from Kumara',
              urls: urls,
            };
            await Share.open(options);
          } catch (error) {
            alert(error.message);
          }
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const _onDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete selected??', [
      {
        text: 'Delete',
        onPress: () => {
          try {
            selectedItems.forEach(async (item) => {
              await RNFS.unlink(item.path);
              Alert.alert('Successfully Deleted selected items');
            });
          } catch (error) {
            console.log(error.message);
          }
        },
      },
      {text: 'Cancel', onPress: () => false},
    ]);
    setSelectedItems([]);
    readDirectory();
  };

  const _onLogout = () => {
    try {
      if (logout) {
        Alert.alert('Logout','Are you sure want to Logout?', [
          {
            text: 'Cancel',
            onPress: () => setLogout(true),
          },
          {
            text: 'Logout',
            onPress: () => {
              Alert.alert(
                "You're successfully looged out!!    Thank you for using our app.",
              );  
              props.navigation.navigate('Welcome');
            },
          },
        ]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => _onLogout()} />
        <Appbar.Content title="Files List" />
        <Appbar.Action icon="magnify" />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>

      {pathsArray.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          {selectedItems.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                padding: 3,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'grey',
                  borderRadius: 10,
                  padding: 5,
                  justifyContent: 'center',
                  elevation: 9,
                }}
                onPress={() => {
                  setSelectedItems(imageArray);
                }}>
                <Text
                  style={{textAlign: 'center', fontSize: 15, color: '#fff'}}>
                  Select All
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  color: '#fff',
                  backgroundColor: 'grey',
                  borderRadius: 10,
                  padding: 5,
                  justifyContent: 'center',
                }}>
                {`${selectedItems.length} - Selected`}
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: 'grey',
                  borderRadius: 10,
                  padding: 5,
                  justifyContent: 'center',
                  elevation: 9,
                }}
                onPress={() => {
                  setSelectedItems([]);
                }}>
                <Text
                  style={{textAlign: 'center', fontSize: 15, color: '#fff'}}>
                  unselect All
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Text
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            {`No Files to show.
Click on the Camera Icon to Crete new File`}
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            justifyContent: 'space-evenly',
            alignSelf: 'center',
          }}
          data={pathsArray}
          numColumns={3}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                borderWidth: selectedItems.includes(item) ? 5 : 0,
                borderColor: 'green',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'space-around',
                padding: selectedItems.includes(item) ? 5 : 10,
                borderRadius: 25,
              }}
              onPress={() => {
                if (selectedItems.length > 0) {
                  let newSL = selectedItems;
                  if (newSL.includes(item)) {
                    let index = newSL.indexOf(item);
                    let retVal = newSL.splice(index, 1);
                    setSelectedItems(newSL);
                    forceRerender(new Date().toString());
                  } else {
                    newSL.push(item);
                    setSelectedItems(newSL);
                    forceRerender(new Date().toString());
                  }
                } else {
                  props.navigation.navigate('FileGallery', {
                    folderPath: item.path,
                  });
                }
              }}
              onLongPress={() => {
                if (selectedItems.length > 0) {
                  //eat
                } else {
                  let newSL = selectedItems;
                  newSL.push(item);
                  setSelectedItems(newSL);
                  forceRerender(new Date().toString());
                }
              }}>
              {/* <Avatar.Icon icon="folder" size={100} /> */}
              <Image
                source={require('../icons/folder.png')}
                style={{height: 80, width: 80}}
              />
              <Text style={{textAlign: 'center', width: 100}}>
                {item.folder}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
        />
      )}

      {selectedItems.length > 0 ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            padding: 3,
          }}>
          <TouchableOpacity onPress={() => _onDelete()}>
            <Text
              style={{
                backgroundColor: 'purple',
                padding: 10,
                width: 150,
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                borderRadius: 15,
                textAlign: 'center',
                justifyContent: 'center',
              }}>
              Delete All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _onShare()}>
            <Text
              style={{
                backgroundColor: 'purple',
                padding: 10,
                width: 150,
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                borderRadius: 15,
                textAlign: 'center',
                justifyContent: 'center',
              }}>
              Share All
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={{
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: 10,
          }}
          onPress={() => props.navigation.navigate('Capture')}>
          <Avatar.Icon icon="camera" size={80} />
        </TouchableOpacity>
      )}
    </View>
  );
};
