// Playlists.js
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import COLORS from '../constants/colors';
import PlaylistModal from "../components/playlistModal";

const defaultPlaylistImage = require('../assets/sound.png');

const Playlists = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const handleAddPlaylist = (playlistName, playlistImage) => {
    // Add the new playlist to the state with a default image if not specified
    setPlaylists([...playlists, { name: playlistName, songs: [], image: playlistImage || defaultPlaylistImage }]);
  };

  const handleDeletePlaylist = (index) => {
    // Implement logic to delete the playlist at the specified index
    const updatedPlaylists = [...playlists];
    updatedPlaylists.splice(index, 1);
    setPlaylists(updatedPlaylists);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {playlists.map((playlist, index) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('PlaylistScreen', { playlistData: playlist })}
          key={index}
          style={{ padding: 5, backgroundColor: COLORS.purple, borderRadius: 5 }}
        >
          <Image source={playlist.image} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
          <Text>{playlist.name}</Text>
          <Text style={{ marginTop: 3, opacity: 0.3, fontSize: 14 }}>{playlist.songs.length} songs</Text>
          {/* Add buttons for playlist options */}
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <TouchableOpacity onPress={() => handleDeletePlaylist(index)} style={{ marginRight: 10 }}>
              <Text style={{ color: COLORS.red }}>Delete</Text>
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
      <PlaylistModal visible={modalVisible} onClose={() => setModalVisible(false)} onAddPlaylist={handleAddPlaylist}></PlaylistModal>
    </ScrollView>
  );
};

export default Playlists;
