import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import COLORS from '../constants/colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const defaultImageCover = require('../assets/sound.png');

const PlaylistScreen = ({ route, navigation }) => {
  const { playlistData } = route.params;
  const { _id, title, imageCover } = playlistData;
  const [isModalVisible, setModalVisible] = useState(false);
  const [musicData, setMusicData] = useState([]);

  useEffect(() => {
    fetchPlaylistMusic();
  }, []);

  const fetchPlaylistMusic = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Fetch the token from AsyncStorage
  
      if (!token) {
        // Handle the case where the token is not available
        console.error('Token not available.');
        return; 
      }
  
      const response = await axios.get(`https://soundmatch-api.onrender.com/playlist/${_id}/music`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setMusicData(response.data.playlist.music);
    } catch (error) {
      console.error('Error fetching playlist music:', error);
    }
  };

  const renderMusicItem = ({ item }) => (
    <View style={styles.musicItem}>
      <Text style={{ color: '#333', fontWeight: 'bold' }}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Playlist Image and Title */}
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Image source={require('../assets/backward.png')} style={styles.backArrowImage} />
      </TouchableOpacity>
      <Image source={{ uri: imageCover }} style={styles.playlistImage} />
      <Text style={styles.playlistTitle}>{title}</Text>

      {/* Music List */}
      <FlatList
        data={musicData}
        keyExtractor={(item) => item.id}
        renderItem={renderMusicItem}
      />
      {/* Share Button */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={() => setModalVisible(true)}
      >
        <Image source={require('../assets/more.png')} style={{ width: 40, height: 40 }}></Image>
      </TouchableOpacity>

      {/* Share Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalContent}>
          <Text>Share your playlist</Text>
          <Text>Edit</Text>
          <Text>Delete</Text>
          {/* Add share functionality here */}
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backArrowImage: {
    width: 30,
    height: 30,
  },
  playlistImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    marginTop: 50,
  },
  playlistTitle: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  musicItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#333',
  },
  shareButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  shareButtonText: {
    color: '#fff',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#333',
  },
});

export default PlaylistScreen;
