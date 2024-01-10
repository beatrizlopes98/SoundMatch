import React from "react";
import {View, Text} from 'react-native';
import COLORS from '../constants/colors'

const Discover = () => {
    return(
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: COLORS.black }}>DISCOVER PAGE</Text>
        </View>
    )
}

export default Discover