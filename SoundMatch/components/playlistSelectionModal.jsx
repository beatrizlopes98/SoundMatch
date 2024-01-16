import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import COLORS from '../constants/colors';

const PlaylistSelectionModal = ({ visible, onClose, playlists, onPlaylistSelect, onCreatePlaylist }) => {
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    setPlaylistName('');
  }, [visible]);

  const handlePlaylistSelect = (index) => {
    onPlaylistSelect(index);
    onClose();
  };

  const handleCreatePlaylist = () => {
    onCreatePlaylist(playlistName);
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
        <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 10, width: 300, backgroundColor: COLORS.greyLight }}>
          <Text style={{ fontSize: 16, marginBottom: 10, color: 'grey' }}>Select or Create Playlist:</Text>
          
          {/* FlatList to display existing playlists */}
          <FlatList
            data={playlists}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: COLORS.grey }}
                onPress={() => handlePlaylistSelect(index)}
              >
                <Text style={{ color: 'grey' }}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Input for creating a new playlist */}
          <TextInput
            style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 8, marginVertical: 10, color: 'grey' }}
            placeholder="New Playlist Name"
            value={playlistName}
            onChangeText={setPlaylistName}
          />

          {/* Button to create a new playlist */}
          <TouchableOpacity
            style={{ backgroundColor: COLORS.purple, padding: 10, borderRadius: 5 }}
            onPress={handleCreatePlaylist}
          >
            <Text style={{ color: COLORS.white, textAlign: 'center' }}>Create Playlist</Text>
          </TouchableOpacity>

          {/* Button to close the modal */}
          <TouchableOpacity
            style={{ backgroundColor: COLORS.red, padding: 10, borderRadius: 5, marginTop: 10 }}
            onPress={onClose}
          >
            <Text style={{ color: COLORS.white, textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PlaylistSelectionModal;

