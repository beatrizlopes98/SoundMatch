import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import COLORS from '../constants/colors';
import PlaylistModal from "../components/playlistModal";

const defaultPlaylistImage = require('../assets/sound.png');

const Playlists = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddPlaylist = (playlistTitle, playlistImage) => {
    const newPlaylist = { title: playlistTitle, songs: [], image: playlistImage || defaultPlaylistImage };
    setPlaylists([...playlists, newPlaylist]);
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

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {playlists.map((playlist, index) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('PlaylistScreen', { playlistData: playlist })}
          key={index}
          style={{ padding: 5, backgroundColor: COLORS.purple, borderRadius: 5 }}
        >
          <Image source={playlist.image} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
          <Text>{playlist.title}</Text>
          <Text style={{ marginTop: 3, opacity: 0.3, fontSize: 14 }}>{playlist.songs.length} songs</Text>
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






