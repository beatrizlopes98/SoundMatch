import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../constants/colors';


const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  const getRandomPosition = (index, total) => {
    const { width, height } = Dimensions.get('window');
    const x = (width / total) * index;
    const y = Math.floor(Math.random() * (height - 100)); // Adjust 100 based on button size
    return { left: x, top: y };
  };

const GenderSelect = ({navigation}) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [shuffledGenres, setShuffledGenres] = useState([]);

  const allGenres = ['Pop','Rock','Hip-Hop & Rap','Country','R&B','Folk','Jazz','Heavy Metal','EDM','Soul','Funk','Reggae','Disco','Punk Rock','Classical','House','Techno','Indie Rock','Grunge','Ambient','Gospel','Latin Music','Grime','Trap','Psychedelic Rock'];

  useEffect(() => {
    setShuffledGenres(shuffleArray([...allGenres]));
  }, []);

  const handleGenreSelection = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((selected) => selected !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };
  const saveSelectedGenres = async () => {
    try {
      // Retrieve the access token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        // Handle the case where the token is not available
        Alert.alert('Error', 'Token not available. Please log in again.');
        return;
      }

      // Make a PUT request to update the profile using Axios
      const response = await axios.put(
        'https://soundmatch-api.onrender.com/user/add-genres',
        {
          "genres": selectedGenres
          // Add other fields you want to update in the API request
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Profile updated successfully
        Alert.alert('Success', 'Genres added successfully');
        navigation.navigate('MainTabs')
      } else {
        // Handle failed profile update or show error message
        Alert.alert('Error', 'Failed to add genres. Please try again.');
      }
    } catch (error) {
      console.error('Error during genres add:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    console.log('Selected Genres:', selectedGenres);
  }, [selectedGenres]);

  return (
    <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
    <View style={styles.container}>
      {shuffledGenres.map((genre, index) => (
        <Button
          key={genre}
          title={genre}
          onPress={() => handleGenreSelection(genre)}
          color={selectedGenres.includes(genre) ? COLORS.purple : 'gray'}
          style={{ position: 'absolute', ...getRandomPosition(index, shuffledGenres.length) }}
        />
      ))}
    </View>
    <View style={{flex:1}}>
        <Button title='DONE' onPress={saveSelectedGenres} ></Button>
    </View>
    <View style={{flex:1}}>
        <Button title='NEXT PAGE' onPress={()=>navigation.navigate('MainTabs')} ></Button>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop:20
  },
});


export default GenderSelect;













