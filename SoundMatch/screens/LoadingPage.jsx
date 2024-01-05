import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import Login from './Login';
import COLORS from '../constants/colors';


const LoadingPage = ({navigation}, props) => {
    setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
      
    return (
        <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
            <Text style={{color:COLORS.black, fontSize: 40}}>SoundMatch</Text>
        </View>
    )
};

export default LoadingPage
