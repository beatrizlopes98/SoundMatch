import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert, Share, Modal, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import PlaylistModal from '../components/playlistModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

const Playlists = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [nfcWriteInProgress, setNfcWriteInProgress] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserPlaylists();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchUserPlaylists();
    return () => {
      // No explicit NFC cleanup here.
    };
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
        const likedSongsIndex = playlists.findIndex((playlist) => playlist.title === 'Liked songs');

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
            imageCover: response.data.playlist.imageCover, // Use the default image for new playlists
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
        const response = await axios.put(
          `https://soundmatch-api.onrender.com/playlist/edit/${playlistIdToEdit}`,
          {
            title: playlistTitle,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        if (response.status === 200) {
          setPlaylists((prevPlaylists) => {
            const updatedPlaylists = [...prevPlaylists];
            updatedPlaylists[index].title = response.data.playlist.title;
            return updatedPlaylists;
          });

          // Fetch the updated playlists from the API
          fetchUserPlaylists();
        }
      }
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
        const response = await axios.delete(
          `https://soundmatch-api.onrender.com/playlist/delete/${playlistIdToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 204) {
          // If the API call is successful, update the local state
          const updatedPlaylists = playlists.filter((playlist) => playlist._id !== playlistIdToDelete);

          // Find the index of the "Liked Songs" playlist
          const likedSongsIndex = updatedPlaylists.findIndex((playlist) => playlist.title === 'Liked songs');

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
  
        // Check if the playlist object has the required properties
        if (playlist && playlist.externalUrl) {
          // Set the selected playlist for sharing
          setSelectedPlaylist(playlist);
  
          // Show the modal with writing to NFC tag option
          setShareModalVisible(true);
  
          // Do not call handleNfcWrite here; it will be called when the user chooses to write to NFC tag
        } else {
          console.warn('Invalid playlist data:', playlist);
        }
      }
    } catch (error) {
      console.error('Error fetching playlist details:', error);
    }
  };
  
  const handleShareOptionSelected = async (writeToNfcTag) => {
    setShareModalVisible(false);
  
    if (writeToNfcTag) {
      // If the user chooses to write to NFC tag, call handleNfcWrite
      handleNfcWrite(selectedPlaylist?.externalUrl);
    } else {
      // If the user chooses to share normally, call handleNormalShare
      handleNormalShare(selectedPlaylist?.externalUrl);
    }
  };
  const handleNormalShare = (externalUrl) => {
    Share.share({
      message: `Check out this playlist on Spotify: ${externalUrl}`,
    })
      .catch((error) => console.error(error));
    setShareModalVisible(false); // Close the modal after sharing
  };

  const initializeNfc = async () => {
    try {
      if (await NfcManager.isSupported()) {
        // Initialize NFC manager
        await NfcManager.start();
        
        // Request NFC technology
        await NfcManager.requestTechnology(NfcTech.Ndef, {
          alertMessage: 'Ready to write Spotify link to NFC Tag!',
        });
      } else {
        console.warn('NFC is not supported on this device');
      }
    } catch (ex) {
      console.warn('NFC initialization error:', ex);
    }
  };
  

  const handleNfcWrite = async (playlist) => {
    try {
      if (!playlist || nfcWriteInProgress) {
        console.warn('Invalid playlist data or NFC write in progress:', playlist);
        return;
      }
  
      setNfcWriteInProgress(true);
  
      // Extract the playlist link from the provided playlist object
      const playlistLink = playlist;
      console.log('Playlist Link:', playlistLink);
  
      // Initialize NFC manager
      await initializeNfc(true);
  
      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to write Spotify link to NFC Tag!',
      });
  
      // Introduce a delay (e.g., 500 milliseconds) before NFC writing
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      // Create a custom text record for the playlist link
      const textPayload = Ndef.textRecord(playlistLink);
      console.log('Text Payload:', textPayload);
  
      // Writing to NFC tag
      console.log('Writing to NFC tag');
      await NfcManager.writeNdefMessage([textPayload]);
      console.log('NFC write successful');
  
      // Show success message
      Alert.alert('Success', 'Spotify link written to NFC Tag!');
    } catch (ex) {
      console.warn('NFC writing error:', ex);
      Alert.alert('Error', 'Failed to write to NFC Tag. Please try again.');
    } finally {
      // Cancel NFC technology request
      await NfcManager.cancelTechnologyRequest();
      setNfcWriteInProgress(false);
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
            <Image source={{ uri: playlist.imageCover }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
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
                handleSharePlaylist(index);
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
            onPress={() => handleShareOptionSelected(false)} // Share normally
            style={styles.modalButton}
          >
            <Text style={styles.modalButtonText}>Share normally</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleShareOptionSelected(true)} // Write to NFC Tag
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

const styles = StyleSheet.create({
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

export default Playlists;


