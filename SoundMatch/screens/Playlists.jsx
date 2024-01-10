import React from "react";
import {View, Text} from 'react-native';
import COLORS from '../constants/colors'

const Playlists = () => {
    return(
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: COLORS.black }}>PLAYLISTS PAGE</Text>
        </View>
    )
}

export default Playlists;