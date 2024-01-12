import React, { useState } from "react";
import {View, Modal, TextInput, Image, Dimensions, TouchableWithoutFeedback, StyleSheet, TouchableOpacity} from 'react-native';
import COLORS from "../constants/colors";

const {width} = Dimensions.get('window');
const PlaylistModal = ({visible, onClose}) =>{
    const[playListName, setPlayListName] = useState('');
    return(
        <Modal visible={visible} animationType="fade" transparent>
            <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                <View style={{width: width-20, height:200, borderRadius: 10, backgroundColor:'white', justifyContent:'center', alignItems: 'center'}}>
                    <TextInput value={playListName} onChangeText={(text)=> setPlayListName(text)} style={{width: width-40, borderBottomWidth: 1, borderBottomColor: COLORS.purple, fontSize: 18, paddingVertical:5, color: COLORS.black}}placeholderTextColor={COLORS.black} placeholder="Insert name for your playlist"></TextInput>
                    <TouchableOpacity onPress={()=>{console.log(playListName)}}>
                    <Image source={require('../assets/plus.png')} style={{width:24, height:24, padding:10, tintColor: COLORS.violet, borderRadius:50, marginTop:15}}></Image>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[StyleSheet.absoluteFillObject ,{backgroundColor: 'grey', zIndex:-1}]}/>
            </TouchableWithoutFeedback>

        </Modal>
    )
}


export default PlaylistModal;