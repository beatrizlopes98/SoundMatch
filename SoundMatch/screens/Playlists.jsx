import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import COLORS from '../constants/colors';
import PlaylistModal from '../components/playlistModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleAddPlaylist } from '../utilities/apiUtils'; // Adjust the path accordingly

const defaultPlaylistImage = require('../assets/sound.png');

const Playlists = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  const fetchUserPlaylists = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (token) {
        const response = await axios.get('https://soundmatch-api.onrender.com/playlist/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const playlists = response.data.playlists;
  
        // Find the index of the "Liked Songs" playlist
        const likedSongsIndex = playlists.findIndex(
          (playlist) => playlist.title === 'Liked songs'
        );
  
        // Move the "Liked Songs" playlist to the beginning if it exists
        if (likedSongsIndex !== -1) {
          const likedSongsPlaylist = {
            ...playlists[likedSongsIndex],
            imageCover: '../assets/heart.png', // Change the imageCover here
          };
  
          // Remove the "Liked Songs" playlist from its original position
          playlists.splice(likedSongsIndex, 1);
  
          // Add the "Liked Songs" playlist at the beginning
          playlists.unshift(likedSongsPlaylist);
        }
  
        // Set the playlists in state
        setPlaylists(playlists);
      }
    } catch (error) {
      console.log('Error fetching user playlists:', error);
    }
  };
  

  const handleAddPlaylist = async (playlistTitle) => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (token) {
        const response = await axios.post(
          'https://soundmatch-api.onrender.com/playlist/create',
          {
            title: playlistTitle,
            // You can add any additional parameters here
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 201) {
          // If the playlist is created successfully, update the local state
          const newPlaylist = {
            title: response.data.playlist.title,
            music: [],
            imageCover: defaultPlaylistImage, // Use the default image for new playlists
          };
  
          setPlaylists([...playlists, newPlaylist]);
          fetchUserPlaylists();
        } else {
          // Handle other response statuses if needed
          console.log('Failed to create a playlist:', response);
        }
      }
    } catch (error) {
      console.log('Error adding a new playlist:', error);
    }
  };
  

  const handleEditPlaylist = async (index, playlistTitle) => {
    try {
      console.log(playlists)
      console.log(index)
      console.log(playlistTitle)
      const playlistIdToEdit = playlists[index]._id; // Assuming your playlists array contains playlist objects with an '_id' field
      const token = await AsyncStorage.getItem('token');
      // Make HTTP request to your API to edit the playlist title
      console.log(playlistTitle)
      if (token) {
      const response = await axios.put(`https://soundmatch-api.onrender.com/playlist/edit/${playlistIdToEdit}`, {
        title: playlistTitle
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if(response.status === 200) {
        setPlaylists((prevPlaylists) => {
          const updatedPlaylists = [...prevPlaylists];
          updatedPlaylists[index].title = response.data.playlist.title;
          return updatedPlaylists;
        });



        // Fetch the updated playlists from the API
        fetchUserPlaylists();

    }}
  
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error(`Error editing playlist: ${error.message}`);
    }
  };

  const handleDeletePlaylist = async (index) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const playlistIdToDelete = playlists[index]._id;
  
      if (token) {
        const response = await axios.delete(`https://soundmatch-api.onrender.com/playlist/delete/${playlistIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 204) {
          // If the API call is successful, update the local state
          const updatedPlaylists = playlists.filter((playlist) => playlist._id !== playlistIdToDelete);
  
          // Find the index of the "Liked Songs" playlist
          const likedSongsIndex = updatedPlaylists.findIndex(
            (playlist) => playlist.title === 'Liked songs'
          );
  
          // Move the "Liked Songs" playlist to the beginning if it exists
          if (likedSongsIndex !== -1) {
            const likedSongsPlaylist = {
              ...updatedPlaylists[likedSongsIndex],
              imageCover: '../assets/heart.png', // Change the imageCover here
            };
  
            // Remove the "Liked Songs" playlist from its original position
            updatedPlaylists.splice(likedSongsIndex, 1);
  
            // Add the "Liked Songs" playlist at the beginning
            updatedPlaylists.unshift(likedSongsPlaylist);
          }
  
          setPlaylists(updatedPlaylists);
          Alert.alert('Success', 'Playlist deleted successfully');
          fetchUserPlaylists();
        }
      }
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error(`Error deleting playlist: ${error.message}`);
    }
  };
  
  
  

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={() => fetchUserPlaylists()} />
    }>
      {playlists.map((playlist, index) => {
        return(
        <TouchableOpacity
          onPress={() => navigation.navigate('PlaylistScreen', { playlistData: playlist })}
          key={index}
          style={{ padding: 5, backgroundColor: COLORS.purple, borderRadius: 5, marginBottom:5 }}
        >
          <Image source={defaultPlaylistImage} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
          <Text>{playlist.title}</Text>
          <Text style={{ marginTop: 3, opacity: 0.3, fontSize: 14 }}>{playlist.music.length} songs</Text>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <TouchableOpacity onPress={() => handleDeletePlaylist(index)} style={{ marginRight: 10 }}>
              <Text style={{ color: COLORS.red }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() =>{setEditIndex(index),setModalVisible(true)}} style={{ marginRight: 10 }}>
              <Text style={{ color: COLORS.blue }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Share')}>
              <Text style={{ color: COLORS.blue }}>Share</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
)})}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginTop: 15 }}>
        <Text style={{ color: COLORS.violet, letterSpacing: 1, fontWeight: 'bold', fontSize: 14, padding: 5 }}>+ Add New Playlist</Text>
      </TouchableOpacity>
      <PlaylistModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditIndex(null);
        }}
        onSaveChanges={(index,title) => {
          if (editIndex !== null) {
            handleEditPlaylist(index, title);
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






