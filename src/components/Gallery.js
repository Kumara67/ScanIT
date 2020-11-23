import React, {Component, useState, useEffect} from 'react';
import {Appbar} from 'react-native-paper';
import * as RNFS from 'react-native-fs';
import {View, Text, TouchableOpacity, FlatList, Image, Alert} from 'react-native';

import Share from 'react-native-share';

export default Gallery = (props) => {
  const [imageArray, setImages] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [rerender, forceRerender] = useState('someKey');
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
    let folderPath =
      RNFS.ExternalDirectoryPath + '/' + props.route.params.folderName;
    let res = await RNFS.readdir(folderPath);
    var count = 0;
    var results = [];
    res.forEach((item) => {
      results.push({
        key: (count + 1).toString(),
        path: folderPath + '/' + item,
      });
      count = count + 1;
      if (count === res.length) {
        setImages(results);
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
  };

  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Appbar.Content title={props.route.params.folderName} />
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
              setSelectedItems(imageArray);
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
              setSelectedItems([]);
            }}>
            <Text style={{textAlign: 'center', fontSize: 15, color: '#fff'}}>
              unselect All
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        style={{flex: 1}}
        numColumns={2}
        data={imageArray}
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
                  setSelectedItems(newSL);
                  forceRerender(new Date().toString());
                } else {
                  newSL.push(item);
                  setSelectedItems(newSL);
                  forceRerender(new Date().toString());
                }
              } else {
                props.navigation.navigate('Preview', {
                  path: item.path,
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
            <Image
              source={{uri: `file://${item.path}`}}
              style={{height: 170, width: 170, borderRadius: 10}}></Image>
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
            onPress={() => props.navigation.goBack()}
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
            onPress={() => props.navigation.goBack()}
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
