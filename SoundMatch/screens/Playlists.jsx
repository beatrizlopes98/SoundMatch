import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert, Share, Modal, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import PlaylistModal from '../components/playlistModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager'; // Import NfcManager and related modules
import { handleAddPlaylist } from '../utilities/apiUtils';

const defaultPlaylistImage = require('../assets/sound.png');

const Playlists = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [nfcSharing, setNfcSharing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserPlaylists();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
            imageCover: 'https://t3.ftcdn.net/jpg/05/46/92/20/360_F_546922056_qLvb0l3rF2od0PdCtw3nsCi2KXjO8bD3.jpg', // Change the imageCover here
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
            imageCover: response.data.playlist.imageCover // Use the default image for new playlists
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
      const playlistIdToEdit = playlists[index]._id; // Assuming your playlists array contains playlist objects with an '_id' field
      const token = await AsyncStorage.getItem('token');

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
              imageCover: 'https://t3.ftcdn.net/jpg/05/46/92/20/360_F_546922056_qLvb0l3rF2od0PdCtw3nsCi2KXjO8bD3.jpg', // Change the imageCover here
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

  const handleSharePlaylist = async (index) => {
    try {
      // Fetch the playlist details including external URL
      const token = await AsyncStorage.getItem('token');
      const playlistId = playlists[index]._id;

      if (token) {
        const response = await axios.get(`https://soundmatch-api.onrender.com/playlist/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const playlist = response.data.playlist;

        // Set the selected playlist for sharing
        setSelectedPlaylist(playlist);

        // Show the modal with sharing options
        setShareModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching playlist details:', error);
    }
  };

  const handleNormalShare = (externalUrl) => {
    Share.share({
      message: `Check out this playlist on Spotify: ${externalUrl}`,
    })
      .catch(error => console.error(error));
    setShareModalVisible(false); // Close the modal after sharing
  };

  const handleNfcShare = async (externalUrl, writeToTag) => {
    try {
      // Check if NFC technology is already in use
      if (nfcSharing) {
        console.warn('NFC request is already in progress. Please wait.');
        return;
      }
  
      // Set NFC sharing flag to true
      setNfcSharing(true);
  
      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to share playlist via NFC!',
      });
  
      if (writeToTag) {
        // Write to NFC tag
        const urlPayload = Ndef.uriRecord(externalUrl);
        await NfcManager.writeNdefMessage([urlPayload]);
  
        // Reconnect after write
        await NfcManager.setAlertMessageIOS('Playlist shared via NFC and written to NFC Tag!');
        await NfcManager.registerTagEvent();
      } else {
        // Share via NFC without writing to tag
        const urlPayload = Ndef.uriRecord(externalUrl);
        await NfcManager.writeNdefMessage([urlPayload]);
        Alert.alert('Success', 'Playlist shared via NFC!');
      }
    } catch (ex) {
      console.warn('NFC sharing error:', ex);
    } finally {
      // Cancel NFC technology request
      NfcManager.cancelTechnologyRequest();
  
      // Reset the NFC sharing flag
      setNfcSharing(false);
    }
  };
  
  

  

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {playlists.map((playlist, index) => {
        const isLikedSongsPlaylist = playlist.title === 'Liked songs';

        return (
          <TouchableOpacity
            onPress={() => navigation.navigate('PlaylistScreen', { playlistData: playlist })}
            key={index}
            style={{ padding: 5, backgroundColor: COLORS.purple, borderRadius: 5, marginBottom: 5 }}
          >
            <Image source={{uri: playlist.imageCover}} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
            <Text>{playlist.title}</Text>
            <Text style={{ marginTop: 3, opacity: 0.3, fontSize: 14 }}>{playlist.music.length} songs</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              {!isLikedSongsPlaylist && (
                <TouchableOpacity onPress={() => handleDeletePlaylist(index)} style={{ marginRight: 10 }}>
                  <Text style={{ color: COLORS.red }}>Delete</Text>
                </TouchableOpacity>
              )}
              {!isLikedSongsPlaylist && (
                <TouchableOpacity onPress={() => { setEditIndex(index), setModalVisible(true) }} style={{ marginRight: 10 }}>
                  <Text style={{ color: COLORS.blue }}>Edit</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => {
              setSelectedPlaylist(playlists[index]);
              setShareModalVisible(true);
            }}>
                <Text style={{ color: COLORS.blue }}>Share</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginTop: 15 }}>
        <Text style={{ color: COLORS.violet, letterSpacing: 1, fontWeight: 'bold', fontSize: 14, padding: 5 }}>+ Add New Playlist</Text>
      </TouchableOpacity>
      {/* Share Modal */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={shareModalVisible}
  onRequestClose={() => setShareModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TouchableOpacity
        onPress={() => {
          setShareModalVisible(false);
          handleNormalShare(selectedPlaylist?.externalUrl);
        }}
        style={styles.modalButton}
      >
        <Text style={styles.modalButtonText}>Share normally</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setShareModalVisible(false);
          handleNfcShare(selectedPlaylist?.externalUrl, false);
        }}
        style={styles.modalButton}
      >
        <Text style={styles.modalButtonText}>Share via NFC</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setShareModalVisible(false);
          handleNfcShare(selectedPlaylist?.externalUrl, true);
        }}
        style={styles.modalButton}
      >
        <Text style={styles.modalButtonText}>Write to NFC Tag</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      {/* Playlist Modal */}
      <PlaylistModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditIndex(null);
        }}
        onSaveChanges={(index, title) => {
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

const styles = StyleSheet.create( {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: COLORS.lavanda,
    borderRadius: 10,
  },
  modalButtonText: {
    color: COLORS.black,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Playlists