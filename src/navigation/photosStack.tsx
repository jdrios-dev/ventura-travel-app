import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {EditAlbum, PhotoDetail, Photos, UploadNewPicture} from '../screens';
import {Screen} from '../constants/screens/screens';

const MyStack = createStackNavigator();
export class PhotosStack extends Component {
  render() {
    return (
      <MyStack.Navigator screenOptions={{headerShown: false}}>
        <MyStack.Screen name={Screen.Photos} component={Photos} />
        <MyStack.Screen
          name={Screen.UploadNewPicture}
          component={UploadNewPicture}
        />
        <MyStack.Screen name={Screen.PhotoDetail} component={PhotoDetail} />
        <MyStack.Screen name={Screen.EditAlbum} component={EditAlbum} />
      </MyStack.Navigator>
    );
  }
}
