import React from "react";
import { View, Text, Image, SafeAreaView, Dimensions, TouchableOpacity } from "react-native";
import COLORS from '../constants/colors';
import Slider from '@react-native-community/slider';

const {width, height} = Dimensions.get('window');
const Match = () => {
  
    return(
        <SafeAreaView style={{flex:1, backgroundColor: COLORS.lavanda}}>
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <View style={{marginBottom:40}}>
                <Text style={{fontSize: 18, fontWeight:600, color: COLORS.black}}>Swipe right to like, swipe left to pass!</Text>
            </View>
            <View style={{width:280, height:320}}>
                <Image  style={{width: 280, height: 280, borderRadius: 15 }} source={require('../assets/danzaOrganica.jpg')}></Image>
            </View>
            <View>
                <Text style={{fontSize: 18, fontWeight:600, textAlign: 'center', color: COLORS.black}}>Song Title</Text>
                <Text style={{fontSize: 16, fontWeight:200, textAlign: 'center', color: COLORS.black }}>Artist Name</Text>
            </View>
            <View>
                <Slider style={{width:350, height:40, marginTop: 15, flexDirection: 'row'}} value={10} minimumValue={0} maximumValue={100} thumbTintColor={COLORS.purple} minimumTrackTintColor={COLORS.purple} maximumTrackTintColor={COLORS.lavanda} onSlidingComplete={()=>{}}/>
                <View style={{width: 340, flexDirection:'row', justifyContent: 'space-between'}}>
                    <Text style={{color:COLORS.black}}>0:00</Text>
                    <Text style={{color: COLORS.black}}>0:30</Text>
                </View>
            </View>
            <View style={{}}>
                <TouchableOpacity onPress={()=>{}}>
                <Image source={require('../assets/play.png')} style={{width:36, height:36, tintColor: COLORS.purple, marginTop: 5}}></Image>
                </TouchableOpacity>
            </View>
        </View>
        <View style={{borderTopColor: COLORS.black, borderTopWidth:0.5, width: width, alignItems: 'center', paddingVertical: 15, marginBottom:10}}>
            <View style={{flexDirection: 'row', justifyContent:'space-between', width: '70%'}}>
            <TouchableOpacity style={{alignItems: 'center', justifyContent:'center'}} onPress={()=>{}}>
                    <Image source={require('../assets/x-mark.png')} style={{width:36, height:36, tintColor: COLORS.purple}}></Image>
                    <Text style={{color: COLORS.purple, fontSize:12}}>Nope</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={{alignItems: 'center', justifyContent:'center'}} onPress={()=>{}}>
                    <Image source={require('../assets/addPlaylist.png')} style={{width:45, height:45, tintColor: COLORS.purple, marginTop: 20}}></Image>
                    <Text style={{color: COLORS.purple, fontSize:12}}>Add to Playlist</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems: 'center', justifyContent:'center'}} onPress={()=>{}}>
                    <Image source={require('../assets/heart.png')} style={{width:36, height:36, tintColor: COLORS.purple}}></Image>
                    <Text style={{color: COLORS.purple, fontSize:12}}>Like</Text>
                </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
    )
}

export default Match