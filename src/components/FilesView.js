import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as RNFS from 'react-native-fs';

export default FilesView = (props) => {
  const [pathsArray, setPathsArray] = useState([]);

  useEffect(() => {
    readDirectory();
  }, []);

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
        console.log(results);
      }
    });
  };
  return (
    <View style={{flex: 1}}>
      {pathsArray.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={pathsArray}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                padding: 10,
              }}>
              <Image
                source={require('../icons/folder.png')}
                style={{height: 100, width: 100}}></Image>
              <Text>{item.folder}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
        />
      )}
    </View>
  );
};
