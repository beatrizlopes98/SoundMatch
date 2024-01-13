
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';


const Profile = ({ navigation }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [isPasswordShown, setPasswordShown] = useState(true);
  
    const handleImageUpload = () => {
      // Implement image upload functionality here
      // Set the selected image as the profile image
      // For demonstration purposes, setting a placeholder image
      setProfileImage(require('../assets/sound.png'));
  
      // Navigate back to the Discover page and pass the updated image URL
      navigation.navigate('Discover', { updatedProfileImage: profileImage });
    };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Image source={require('../assets/backward.png')} style={styles.backArrowImage} />
      </TouchableOpacity>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        {/* Profile Image */}
        <TouchableOpacity onPress={handleImageUpload}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/sound.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={{marginBottom:12}}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Name</Text>
                    <View style={{
                        width:"100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth:1,
                        borderRadius:8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft:22
                    }}>
                        <TextInput 
                        placeholder='Enter your name'
                        placeholderTextColor={COLORS.black}
                        style={{
                            width: "100%"
                        }}/>
                    </View>
                    <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}>
            Password
          </Text>
          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22,
            }}>
            <TextInput
              secureTextEntry={isPasswordShown}
              placeholder="Enter your passsword"
              placeholderTextColor={COLORS.black}
              style={{
                width: '100%',
              }}
            />

            <TouchableOpacity
              onPress={() => setPasswordShown(!isPasswordShown)}
              style={{
                position: 'absolute',
                right: 12,
              }}>
              {isPasswordShown == false ? (
                <Image
                  source={require('../assets/view.png')}
                  style={{height: 24, width: 24}}></Image>
              ) : (
                <Image
                  source={require('../assets/hide.png')}
                  style={{height: 24, width: 24}}></Image>
              )}
            </TouchableOpacity>
          </View>
                    </View>
        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={() => console.log('Save button pressed')}>
          <Text style={styles.saveButtonText}>Save and Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
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
  saveButton: {
    backgroundColor: COLORS.purple,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
