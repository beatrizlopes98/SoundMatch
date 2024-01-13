import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Discover = ({ navigation,route }) => {
    const { params } = route;
  const updatedProfileImage = params?.updatedProfileImage;
  // Sample playlist data (replace with your actual data)
  const playlistData = [
    { id: '1', title: 'Playlist 1', imageUrl: require('../assets/BarMediterraneo.jpg') },
    { id: '2', title: 'Playlist 2', imageUrl: require('../assets/mauskovic.jpg') },
    { id: '3', title: 'Playlist 3', imageUrl: require('../assets/danzaOrganica.jpg') },
    // Add more playlist items as needed
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.navigate('Profile')}>
        <View style={styles.profile}>
          {/* Replace the source prop with the path to the user's profile image */}
          <Image source={updatedProfileImage || require('../assets/sound.png')} style={styles.profileImage} />
        </View>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Recommended Playlist Squares */}
        {playlistData.map((item) => (
  <TouchableOpacity
    key={item.id}
    style={styles.playlistSquare}
    onPress={() => navigation.navigate("PlaylistScreen", { playlistData: { id: item.id, title: item.title, image: item.imageUrl } })}
  >
    <Image source={item.imageUrl} style={styles.playlistImage} />
    <View style={styles.playlistTitleContainer}>
      <Text style={styles.playlistTitle}>{item.title}</Text>
    </View>
  </TouchableOpacity>
))}
      </View>
    </View>
  );
};

    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        color: '#fff',
      },
      profile: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
      },
      profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      },
      mainContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 20,
        justifyContent: 'space-between',
      },
      playlistSquare: {
        width: 150,
        height: 150,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginTop:10
      },
      playlistImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      },
      playlistTitleContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: '#333'
      },
      playlistTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
      },
    });

export default Discover