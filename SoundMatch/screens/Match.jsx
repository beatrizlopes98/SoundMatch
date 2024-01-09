import React from "react";
import { View, Text, Image, SafeAreaView, Dimensions, TouchableOpacity } from "react-native";
import COLORS from '../constants/colors';
import Slider from '@react-native-community/slider';

const {width, height} = Dimensions.get('window');
const Match = () => {
    return(
        <SafeAreaView style={{flex:1, backgroundColor: COLORS.black}}>
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <View style={{width:300, height:340, marginBottom:25}}>
                <Image  style={{width: 300, height: 300, borderRadius: 15 }} source={require('../assets/danzaOrganica.jpg')}></Image>
            </View>
            <View>
                <Text style={{fontSize: 18, fontWeight:600, textAlign: 'center', color: COLORS.pantone}}>Song Title</Text>
                <Text style={{fontSize: 16, fontWeight:200, textAlign: 'center', color: COLORS.pantone }}>Artist Name</Text>
            </View>
            <View>
                <Slider style={{width:350, height:40, marginTop: 25, flexDirection: 'row'}} value={10} minimumValue={0} maximumValue={100} thumbTintColor={COLORS.pantone} minimumTrackTintColor={COLORS.pantone} maximumTrackTintColor={COLORS.lavanda} onSlidingComplete={()=>{}}/>
                <View style={{width: 340, flexDirection:'row', justifyContent: 'space-between'}}>
                    <Text style={{color:COLORS.lavanda}}>0:00</Text>
                    <Text style={{color: COLORS.lavanda}}>0:30</Text>
                </View>
            </View>
            <View style={{}}>
                <TouchableOpacity onPress={()=>{}}>
                <Image source={require('../assets/play.png')} style={{width:36, height:36, tintColor: COLORS.pantone}}></Image>
                </TouchableOpacity>
            </View>
        </View>
        <View style={{borderTopColor: COLORS.pantone, borderTopWidth:1, width: width, alignItems: 'center', paddingVertical: 15 }}>
            <View style={{flexDirection: 'row', justifyContent:'space-between', width: '60%'}}>
                <TouchableOpacity onPress={()=>{}}>
                    <Image source={require('../assets/heart.png')} style={{width:36, height:36, tintColor: COLORS.pantone}}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{}}>
                    <Image source={require('../assets/addPlaylist.png')} style={{width:45, height:45, tintColor: COLORS.pantone, marginTop: 20}}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{}}>
                    <Image source={require('../assets/x-mark.png')} style={{width:36, height:36, tintColor: COLORS.pantone}}></Image>
                </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
    )
}

export default Match