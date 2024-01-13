import React, {useState} from 'react';
import {Text, View, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import COLORS from './constants/colors'
import {Login, Register, LoadingPage, Match, Playlists, Discover, GenderSelect, PlaylistScreen, Profile} from './screens';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [playlists, setPlaylists] = useState([]);
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      tabBarActiveTintColor: COLORS.lavanda,
      tabBarStyle: {
        height:'7%',
        backgroundColor: COLORS.black,
        borderTopWidth:0
      },
    }} >
      <Tab.Screen name="Discover" component={Discover} options={{headerShown:false, tabBarIcon:({focused})=>(
        <Image source={require('./assets/search.png')} style={{width:32, height:32, tintColor: COLORS.lavanda}}></Image>
      )}} />
        <Tab.Screen  name="Match" component={Match} options={{headerShown:false, tabBarIcon:({focused})=>(
          <Image source={require('./assets/plus.png')} style={{width:32, height:32, tintColor: COLORS.lavanda}}></Image>
          
        )}} />
        <Tab.Screen name="Playlists" component={Playlists}  options={{headerShown:false,tabBarIcon:({focused})=>(
        <Image source={require('./assets/playlist.png')} style={{width:32, height:32, tintColor: COLORS.lavanda}}></Image>
        
        )}} />
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
          name='GenderSelect'
          component={GenderSelect}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='MainTabs'
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='PlaylistScreen'
          component={PlaylistScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='Profile'
          component={Profile}
          options={{
            headerShown: false,
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
