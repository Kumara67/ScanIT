import React, {Component, useState, useEffect} from 'react';
import {Appbar} from 'react-native-paper';
import * as RNFS from 'react-native-fs';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import Share from 'react-native-share';
import {connect} from 'react-redux';
import {
  updateImageArray,
  updateReRender,
  updateSelectedItems,
  updateUserFolder,
} from '../actions/actionDefs';
import DBThings from './DBThings';

const dbTransactions = new DBThings();
const Gallery = (props) => {
  // const [imageArray, setImages] = useState([]);
  // const [selectedItems, setSelectedItems] = useState([]);
  const [rerender, forceRerender] = useState('someKey');
  const {selectedItems} = props;

  let folderName = props.route.params.folderName;
  let folderPath = '';

  useEffect(() => {
    if (props.route.params.hasOwnProperty('folderPath')) {
      folderPath = props.route.params.folderPath;
    } else {
      folderPath = `${RNFS.ExternalDirectoryPath}/${folderName}`;
    } 
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
    // let res = await RNFS.readdir(folderPath);
    let res = await dbTransactions.galleryQuery(folderName);
    var count = 0;
    var results = [];
    res.forEach((item) => {
      results.push({
        key: (count + 1).toString(),
        path: folderPath + '/' + item.fileName,
      });
      count = count + 1;
      if (count === res.length) {
        props.updateImageArray(results);
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
    readDirectory();
    props.updateSelectedItems([]);
  };

  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            props.updateUserFolder('');
            props.updateSelectedItems([]);
            props.navigation.navigate('FilesList');
          }}
        />
        <Appbar.Content title={folderName} />
        <Appbar.Action icon="magnify" />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>

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
              props.updateSelectedItems(props.imageArray);
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
            {`${props.selectedItems.length} - Selected`}
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
              unselect All
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        style={{flex: 1}}
        contentContainerStyle={{alignItems: 'center'}}
        numColumns={2}
        data={props.imageArray}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              borderWidth: selectedItems.includes(item) ? 5 : 0,
              borderColor: 'green',
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'space-around',
              padding: 10,
              borderRadius: 15,
            }}
            onPress={() => {
              if (selectedItems.length > 0) {
                let newSL = selectedItems;
                if (newSL.includes(item)) {
                  let index = newSL.indexOf(item);
                  newSL.splice(index, 1);
                  // setSelectedItems(newSL);
                  props.updateSelectedItems([]);
                  forceRerender(new Date().toString());
                  // props.updateReRender(new Date().toString());
                } else {
                  newSL.push(item);
                  // setSelectedItems(newSL);
                  props.updateSelectedItems(newSL);
                  // props.updateReRender(new Date().toString());
                  forceRerender(new Date().toString());
                }
              } else {
                props.navigation.navigate('Preview', {
                  path: item.path,
                  folderName : folderName,
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
            <Image
              source={{uri: `file://${item.path}`}}
              style={{height: 150, width: 150, borderRadius: 10}}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
      />
      <TouchableOpacity
        style={{
          flex: 0.08,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        {selectedItems.length > 0 ? (
          <Text
            onPress={() => _onDelete()}
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
            Delete
          </Text>
        ) : (
          <Text
            onPress={() => {
              props.navigation.navigate('FilesList');
              props.updateUserFolder('');
            }}
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
            Back
          </Text>
        )}
        {selectedItems.length > 0 ? (
          <Text
            onPress={() => _onShare()}
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
            Share
          </Text>
        ) : (
          <Text
            onPress={() =>
              props.navigation.navigate('Capture', {
                folderName: folderName,
              })
            }
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
            Add More
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    selectedItems: state.FileReducer.selectedItems,
    imageArray: state.FileReducer.imageArray,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedItems: (item) => dispatch(updateSelectedItems(item)),
    updateImageArray: (item) => dispatch(updateImageArray(item)),
    updateReRender: (item) => dispatch(updateReRender(item)),
    updateUserFolder: (item) => dispatch(updateUserFolder(item)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
