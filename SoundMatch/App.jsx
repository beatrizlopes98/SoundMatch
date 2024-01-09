import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import COLORS from './constants/colors'
import {Login, Register, LoadingPage, Match, Playlists, Discover} from './screens';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Match" component={Match} options={{headerShown:false}} />
      <Tab.Screen name="Playlists" component={Playlists} options={{headerShown:false}}/>
      <Tab.Screen name="Discover" component={Discover} options={{headerShown:false}}/>
    </Tab.Navigator>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const initialScreen = isLoggedIn ? 'MainTabs' : 'LoadingPage';
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName={initialScreen}
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
        <Stack.Screen
          name='MainTabs'
          component={TabNavigator}
          options={{
            headerShown: false
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
