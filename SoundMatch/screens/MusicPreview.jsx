import React, { useState, useEffect } from 'react';
import { View, Text, Image, SafeAreaView, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

const { width } = Dimensions.get('window');

const MusicPreview = ({ route, navigation}) => {
  const { music } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load the sound file on component mount
    const newSound = new Sound(music.previewURL, '', (error) => {
      if (error) {
        console.log('Error loading sound:', error);
      }
    });

    setSound(newSound);

    // Cleanup on component unmount
    return () => {
      if (newSound) {
        newSound.release();
      }
    };
  }, [music.previewURL]);

  const handleTogglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play((success) => {
          if (!success) {
            console.log('Error during playback');
          }
        });
      }

      setIsPlaying(!isPlaying);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Image source={require('../assets/backward.png')} style={styles.backArrowImage} />
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 280, height: 320, marginTop: 50 }}>
          <Image style={{ width: 280, height: 280, borderRadius: 15 }} source={{ uri: music.imageURL }} />
        </View>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 600, textAlign: 'center', color: '#000000' }}>{music.name}</Text>
          <Text style={{ fontSize: 16, fontWeight: 200, textAlign: 'center', color: '#000000' }}>{music.artist}</Text>
        </View>
        <View>
          {/* Play/Pause Button */}
          <TouchableOpacity onPress={handleTogglePlay}>
            <Image
              source={isPlaying ? require('../assets/pause.png') : require('../assets/play.png')}
              style={{ width: 36, height: 36, tintColor: '#000000', marginTop: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    backArrow: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
      },
      backArrowImage: {
        width: 30,
        height: 30,
      }
})

export default MusicPreview;



