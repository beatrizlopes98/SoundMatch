import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import COLORS from '../constants/colors';
import PlaylistModal from "../components/playlistModal";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultPlaylistImage= require('../assets/sound.png');

const Playlists = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddPlaylist = async (playlistTitle, playlistImage) => {
    try {
      // Retrieve the access token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
  
      if (token) {
        // Make a POST request to create a new playlist
        const response = await axios.post(
          'https://soundmatch-api.onrender.com/playlist/create',
          {
            title: playlistTitle,
            imageCover: playlistImage
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const newPlaylist = { title: response.data.playlist.title, music: [], imageCover: response.data.playlist.imageCover || defaultPlaylistImage };
        setPlaylists([...playlists, newPlaylist]);
      }
    } catch (error) {
      console.log('Error adding a new playlist:', error);
    }
  }; 


  const handleEditPlaylist = (index, playlistTitle) => {
    setEditIndex(index);
    setModalVisible(true);
  };

  const handleDeletePlaylist = (index) => {
    const updatedPlaylists = [...playlists];
    updatedPlaylists.splice(index, 1);
    setPlaylists(updatedPlaylists);
  };
  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        // Retrieve the access token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        console.log(token)

        if (token) {
          // Fetch user profile using the access token
          const response = await axios.get('https://soundmatch-api.onrender.com/playlist/all', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const playlists= response.data.playlists

          // Set user data in state
          setPlaylists(playlists);
          // You may choose not to pre-fill the password for security reasons
          // setPassword(userData.password);
        }
      } catch (error) {
        console.log('Error fetching user playlists:', error);
      }
    };

    fetchUserPlaylists();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {playlists.map((playlist, index) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('PlaylistScreen', { playlistData: playlist })}
          key={index}
          style={{ padding: 5, backgroundColor: COLORS.purple, borderRadius: 5, marginBottom:5 }}
        >
          <Image source={playlist.imageCover} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
          <Text>{playlist.title}</Text>
          <Text style={{ marginTop: 3, opacity: 0.3, fontSize: 14 }}>{playlist.music.length} songs</Text>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <TouchableOpacity onPress={() => handleDeletePlaylist(index)} style={{ marginRight: 10 }}>
              <Text style={{ color: COLORS.red }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEditPlaylist(index, playlist.title)} style={{ marginRight: 10 }}>
              <Text style={{ color: COLORS.blue }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Share')}>
              <Text style={{ color: COLORS.blue }}>Share</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginTop: 15 }}>
        <Text style={{ color: COLORS.violet, letterSpacing: 1, fontWeight: 'bold', fontSize: 14, padding: 5 }}>+ Add New Playlist</Text>
      </TouchableOpacity>
      <PlaylistModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditIndex(null);
        }}
        onSaveChanges={(title) => {
          if (editIndex !== null) {
            const updatedPlaylists = [...playlists];
            updatedPlaylists[editIndex] = { ...updatedPlaylists[editIndex], title };
            setPlaylists(updatedPlaylists);
          } else {
            handleAddPlaylist(title);
          }
          setEditIndex(null);
          setModalVisible(false);
        }}
        editIndex={editIndex}
        playlists={playlists}
      />
    </ScrollView>
  );
};

export default Playlists;






