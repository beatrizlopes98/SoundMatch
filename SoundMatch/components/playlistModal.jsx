import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import COLORS from '../constants/colors';

const PlaylistModal = ({ visible, onClose, onAddPlaylist }) => {
  const [playlistName, setPlaylistName] = useState('');

  const handleAddPlaylist = () => {
    // Add the new playlist and close the modal
    onAddPlaylist(playlistName);
    setPlaylistName('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 10, width: 300 }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Enter Playlist Name:</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: COLORS.gray, borderRadius: 5, padding: 8, marginBottom: 10 }}
            value={playlistName}
            onChangeText={setPlaylistName}
          />
          <TouchableOpacity
            style={{ backgroundColor: COLORS.purple, padding: 10, borderRadius: 5 }}
            onPress={handleAddPlaylist}
          >
            <Text style={{ color: COLORS.white, textAlign: 'center' }}>Add Playlist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PlaylistModal;