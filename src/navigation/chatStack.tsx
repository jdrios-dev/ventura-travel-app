import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NewChatScreen} from '../screens';
import {Screen} from '../constants/screens/screens';

const MyStack = createStackNavigator();
export class ChatStack extends Component {
  render() {
    return (
      <MyStack.Navigator
        initialRouteName={Screen.NewChatScreen}
        screenOptions={{headerShown: false}}>
        <MyStack.Screen name={Screen.NewChatScreen} component={NewChatScreen} />
      </MyStack.Navigator>
    );
  }
}
