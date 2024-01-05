import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import COLORS from './constants/colors'
import {Login, Register, LoadingPage} from './screens';

const Stack = createNativeStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName='LoadingPage'
      >
        <Stack.Screen
        name='LoadingPage'
        component={LoadingPage}
        options={{
          headerShown:false,
          contentStyle: {backgroundColor: COLORS.lavanda}
        }}
        />
        <Stack.Screen
        name='Login'
        component={Login}
        options={{
          headerShown:false,
          contentStyle: {backgroundColor: COLORS.lavanda}
        }}
        />
        <Stack.Screen
        name='Register'
        component={Register}
        options={{
          headerShown:false,
          contentStyle: {backgroundColor: COLORS.lavanda}
        }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
