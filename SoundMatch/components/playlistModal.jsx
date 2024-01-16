import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import COLORS from '../constants/colors';

const PlaylistModal = ({ visible, onClose, onSaveChanges, editIndex, playlists }) => {
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    if (editIndex !== null) {
      setPlaylistName(playlists[editIndex].title);
    } else {
      setPlaylistName('');
    }
  }, [editIndex, playlists]);

  const handleSaveChanges = () => {
    
    onSaveChanges(editIndex, playlistName);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 10, width: 300, backgroundColor: COLORS.greyLight }}>
          <Text style={{ fontSize: 16, marginBottom: 10, color: 'grey' }}>{editIndex !== null ? 'Edit' : 'Enter'} Playlist Name:</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 8, marginBottom: 10, color:'grey' }}
            value={playlistName}
            onChangeText={setPlaylistName}
          />
          <TouchableOpacity
            style={{ backgroundColor: COLORS.purple, padding: 10, borderRadius: 5 }}
            onPress={handleSaveChanges}
          >
            <Text style={{ color: COLORS.white, textAlign: 'center' }}>
              {editIndex !== null ? 'Save Changes' : 'Add Playlist'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PlaylistModal;


