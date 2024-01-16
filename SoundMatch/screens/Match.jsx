import React, { useState, useEffect } from 'react';
import { View, Text, Image, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import COLORS from '../constants/colors';
import Slider from '@react-native-community/slider';
import { handleAddPlaylist } from '../utilities/apiUtils'; // Adjust the path accordingly
import PlaylistSelectionModal from '../components/playlistSelectionModal';

const { width, height } = Dimensions.get('window');

const Match = () => {
  const initialSongs = [
    { title: 'Song 1', artist: 'Artist 1', image: require('../assets/danzaOrganica.jpg') },
    { title: 'Song 2', artist: 'Artist 2', image: require('../assets/mauskovic.jpg') },
    { title: 'Song 3', artist: 'Artist 3', image: require('../assets/abcDialect.jpg') },
  ];
  const [songs, setSongs] = useState(initialSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const handleNope = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handleLike = async () => {
    const likedSongsPlaylistTitle = 'Liked songs';

    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const response = await axios.get('https://soundmatch-api.onrender.com/playlist/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const playlists = response.data.playlists;
        const likedSongsPlaylist = playlists.find(
          (playlist) => playlist.title === likedSongsPlaylistTitle
        );

        if (!likedSongsPlaylist) {
          await handleAddPlaylist(likedSongsPlaylistTitle, token);
        }

        // Additional logic or navigation if needed
        // ...

        // Move to the next song
        handleNope();
      }
    } catch (error) {
      console.log('Error handling like:', error);
    }
  };

  const currentSong = songs[currentSongIndex];
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get('https://soundmatch-api.onrender.com/playlist/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlaylists(response.data.playlists);
      }
    } catch (error) {
      console.log('Error fetching playlists:', error);
    }
  };
  const handleAddToPlaylist = () => {
    setPlaylistModalVisible(true);
  };
  const handlePlaylistSelect = (selectedPlaylist) => {
    // Logic to add the current song to the selected playlist
    console.log('Adding to playlist:', selectedPlaylist.title);
    setPlaylistModalVisible(false);
  };

  const handleCreatePlaylist = (newPlaylistName) => {
    // Logic to create a new playlist with the given name and add the current song
    console.log('Creating new playlist:', newPlaylistName);
    setPlaylistModalVisible(false);
  };
    
   
    return(
        <SafeAreaView style={{flex:1, backgroundColor: COLORS.lavanda}}>
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <View style={{marginBottom:40}}>
                <Text style={{fontSize: 18, fontWeight:600, color: COLORS.black}}>Swipe right to like, swipe left to pass!</Text>
            </View>
            <View style={{width:280, height:320}}>
                <Image  style={{width: 280, height: 280, borderRadius: 15 }} source={currentSong.image}></Image>
            </View>
            <View>
                <Text style={{fontSize: 18, fontWeight:600, textAlign: 'center', color: COLORS.black}}>{currentSong.title}</Text>
                <Text style={{fontSize: 16, fontWeight:200, textAlign: 'center', color: COLORS.black }}>{currentSong.artist}</Text>
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
            <TouchableOpacity style={{alignItems: 'center', justifyContent:'center'}} onPress={handleNope}>
                    <Image source={require('../assets/x-mark.png')} style={{width:36, height:36, tintColor: COLORS.purple}}></Image>
                    <Text style={{color: COLORS.purple, fontSize:12}}>Nope</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={{alignItems: 'center', justifyContent:'center'}} onPress={handleAddToPlaylist}>
                    <Image source={require('../assets/addPlaylist.png')} style={{width:45, height:45, tintColor: COLORS.purple, marginTop: 20}}></Image>
                    <Text style={{color: COLORS.purple, fontSize:12}}>Add to Playlist</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems: 'center', justifyContent:'center'}} onPress={handleLike}>
                    <Image source={require('../assets/heart.png')} style={{width:36, height:36, tintColor: COLORS.purple}}></Image>
                    <Text style={{color: COLORS.purple, fontSize:12}}>Like</Text>
                </TouchableOpacity>
            </View>
        </View>
        <PlaylistSelectionModal
        visible={playlistModalVisible}
        onClose={() => setPlaylistModalVisible(false)}
        playlists={playlists}
        onPlaylistSelect={handlePlaylistSelect}
        onCreatePlaylist={handleCreatePlaylist}
      />
        </SafeAreaView>
    )
}

export default Match