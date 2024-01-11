import React, { useState } from "react";
import {View, Text, ScrollView, TouchableOpacity, AsyncStorage} from 'react-native';
import COLORS from '../constants/colors'
import PlaylistModal from "../components/playlistModal";




const Playlists = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return(
        <ScrollView contentContainerStyle={{padding:20}}>
            <TouchableOpacity style={{padding:5, backgroundColor: COLORS.purple, borderRadius: 5}}>
                <Text>My Favorite</Text>
                <Text style={{ marginTop: 3, opacity:0.3, fontSize:14}}>0 songs</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> setModalVisible(true)} style={{marginTop:15}}>
                <Text style={{color: COLORS.violet, letterSpacing:1, fontWeight: 'bold', fontSize:14, padding:5}}>+ Add New Playlist</Text>
            </TouchableOpacity>
            <PlaylistModal visible={modalVisible} onClose={()=>setModalVisible(false)}></PlaylistModal>
        </ScrollView>
    )
}

export default Playlists;