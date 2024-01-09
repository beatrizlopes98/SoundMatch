import {View, Text, StyleSheet} from 'react-native';
import { Image } from 'react-native';
import React from 'react';
import Login from './Login';
import COLORS from '../constants/colors';


const LoadingPage = ({navigation}, props) => {
    setTimeout(() => {
        navigation.navigate('Login');
      }, 5000);
      
    return (
        <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
            <Image source={require('../assets/logoLoading.gif')} style={{width:150, height:150}}></Image>
            <Text style={{color:COLORS.black, fontSize: 40}}>SoundMatch</Text>
        </View>
    )
};

export default LoadingPage
