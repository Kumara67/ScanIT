import React, {useEffect, useState} from 'react';
import {Appbar, Avatar, Menu, Divider} from 'react-native-paper';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import * as RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {connect} from 'react-redux';
import {
  updatePassword,
  updatePathsArray,
  updateReRender,
  updateSelectedItems,
  updateUserName,
} from '../actions/actionDefs';
import {RSA} from 'react-native-rsa-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SaveCreds from './SaveCreds';
import DBThings from './DBThings';

const dbTransactions = new DBThings();
const FileListView = (props) => {
  // const [pathsArray, setPathsArray] = useState([]);
  // const [selectedItems, setSelectedItems] = useState([]);
  const [rerender, forceRerender] = useState('someKey');
  const [logout, setLogout] = useState(true);
  const [visible, setVisible] = useState(false);
  const [credVisi, setCredVisi] = useState(true);
  const {selectedItems} = props;
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useEffect(() => {
    credsVisible();
    // Subscribe for the focus Listener
    const unsubscribe = props.navigation.addListener('focus', () => {
      readDirectory();
    });
    return () => {
      // Unsubscribe for the focus Listener
      unsubscribe;
    };
  }, [props.navigation]);

  const credsVisible = async () => {
    try {
      const userName = await AsyncStorage.getItem('userName');
      if (userName !== null) {
        setCredVisi(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const readDirectory = async () => {
    // let res = await RNFS.readdir(RNFS.ExternalDirectoryPath);
    let res = await dbTransactions.fileListQuery();
    //  console.log(`DocFiles Result >>  ${res[0].docName}`)
    if (res === undefined) {
      props.updatePathsArray([]);
    } else {
      var count = 0;
      var results = [];
      res.forEach((item) => {
        results.push({
          key: (count + 1).toString(),
          path: item.docPath,
          folderName: item.docName,
        });
        count = count + 1;
        if (count === res.length) {
          props.updatePathsArray(results);
        }
      });
    }
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
              await dbTransactions.deleteFolderQuery(item.folderName);
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
    // setSelectedItems([]);
    props.updateSelectedItems([]);
    readDirectory();
  };

  const _onLogout = () => {
    try {
      if (logout) {
        Alert.alert('Logout', 'Are you sure want to Logout?', [
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
              props.updateUserName('');
              props.updatePassword('');
              // setSelectedItems([]);
              props.updateSelectedItems([]);
              props.navigation.navigate('Welcome');
            },
          },
        ]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteCreds = () => {
    Alert.alert(
      'Delete Credentials',
      'Do you want to delete your stored credentials?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            try {
              // await AsyncStorage.removeItem('userName');
              // await AsyncStorage.removeItem('userPass');
              await AsyncStorage.clear();
              props.updateUserName('');
              props.updatePassword('');
              Alert.alert('Credentials Succesfully Removed.!');
              props.navigation.navigate('Welcome');
            } catch (error) {
              console.log(error.message);
            }
          },
        },
        {
          text: 'No',
          onPress: () => false,
        },
      ],
    );
    closeMenu();
  };

  async function saveCreds(user, pass, defaultPass) {
    try {
      let pubkey = await AsyncStorage.getItem('publicKey');
      let priKey = await AsyncStorage.getItem('privateKey');
      if (pubkey === null || priKey === null) {
        const keys = await RSA.generateKeys(1024);
        await AsyncStorage.setItem('publicKey', keys.public);
        await AsyncStorage.setItem('privateKey', keys.private);
        pubkey = keys.public;
        priKey = keys.private;
      } else {
        pubkey = await AsyncStorage.getItem('publicKey');
        priKey = await AsyncStorage.getItem('privateKey');
      }
      const encryptDefault = await RSA.encrypt(defaultPass, pubkey);
      const encryptUser = await RSA.encrypt(user, pubkey);
      const encryptPass = await RSA.encrypt(pass, pubkey);

      await AsyncStorage.setItem('userName', encryptUser);
      await AsyncStorage.setItem('userPass', encryptPass);
      await AsyncStorage.setItem('defaultPass', encryptDefault);
    } catch (error) {
      console.log(err.message);
    }
  }

  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => _onLogout()} />
        <Appbar.Content title={`Welcome ${props.route.params.userName}`} />
        <Appbar.Action icon="magnify" />

        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => {
                openMenu();
              }}
              color="white"
            />
          }>
          <Menu.Item
            onPress={() => {
              dbTransactions.dropTable();
              console.log('Tables dropped!!');
            }}
            title="Drop tables"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              deleteCreds();
            }}
            title="Delete Credentials"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              _onLogout();
            }}
            title="Logout"
          />
        </Menu>
      </Appbar.Header>
      {credVisi ? (
        <SaveCreds
          saveHandler={() => {
            saveCreds(props.userName, props.userPass, props.defaultPass);
            props.updateUserName('');
            props.updatePassword('');
            setCredVisi(false);
          }}
        />
      ) : null}
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
              // setSelectedItems(props.pathsArray);
              props.updateSelectedItems(props.pathsArray);
            }}>
            <Text style={{textAlign: 'center', fontSize: 15, color: '#fff'}}>
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
              // setSelectedItems([]);
              props.updateSelectedItems([]);
            }}>
            <Text style={{textAlign: 'center', fontSize: 15, color: '#fff'}}>
              Unselect All
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {props.pathsArray.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
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
          data={props.pathsArray}
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
                    // setSelectedItems(newSL);
                    props.updateSelectedItems(newSL);
                    // props.updateReRender(new Date().toString());
                    forceRerender(new Date().toString());
                  } else {
                    newSL.push(item);
                    // setSelectedItems(newSL);
                    props.updateSelectedItems(newSL);
                    // props.updateReRender(new Date().toString());
                    forceRerender(new Date().toString());
                  }
                } else {
                  props.navigation.navigate('Gallery', {
                    folderPath: item.path,
                    folderName: item.folderName,
                  });
                }
              }}
              onLongPress={() => {
                if (selectedItems.length > 0) {
                  //eat
                } else {
                  let newSL = selectedItems;
                  newSL.push(item);
                  // setSelectedItems(newSL);
                  props.updateSelectedItems(newSL);
                  // props.updateReRender(new Date().toString());
                  forceRerender(new Date().toString());
                }
              }}>
              {/* <Avatar.Icon icon="folder" size={100} /> */}
              <Image
                source={require('../icons/folder.png')}
                style={{height: 80, width: 80}}
              />
              <Text style={{textAlign: 'center', width: 100}}>
                {item.folderName}
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
const mapStateToProps = (state) => {
  return {
    pathsArray: state.FileReducer.pathsArray,
    selectedItems: state.FileReducer.selectedItems,
    userName: state.LoginReducer.userName,
    userPass: state.LoginReducer.userPass,
    defaultPass: state.LoginReducer.defaultPass,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updatePathsArray: (path) => dispatch(updatePathsArray(path)),
    updateSelectedItems: (item) => dispatch(updateSelectedItems(item)),
    updateReRender: (render) => dispatch(updateReRender(render)),
    updatePassword: (password) => dispatch(updatePassword(password)),
    updateUserName: (userName) => dispatch(updateUserName(userName)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FileListView);
