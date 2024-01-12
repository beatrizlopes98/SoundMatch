import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Dimensions } from 'react-native';

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
          color={selectedGenres.includes(genre) ? 'blue' : 'gray'}
          style={{ position: 'absolute', ...getRandomPosition(index, shuffledGenres.length) }}
        />
      ))}
    </View>
    <View style={{flex:1}}>
        <Button title='DONE' onPress={()=> { navigation.navigate("MainTabs")}} ></Button>
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













