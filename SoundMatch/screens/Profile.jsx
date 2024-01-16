
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';


const Profile = ({ navigation }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordShown, setPasswordShown] = useState(true);
  
    const handleImageUpload = () => {
      // Implement image upload functionality here
      // Set the selected image as the profile image
      // For demonstration purposes, setting a placeholder image
      setProfileImage(require('../assets/sound.png'));
  
      // Navigate back to the Discover page and pass the updated image URL
      navigation.navigate('Discover', { updatedProfileImage: profileImage });
    };
    const handleSaveProfile = async () => {
      try {
        // Retrieve the access token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
    
        if (!token) {
          // Handle the case where the token is not available
          Alert.alert('Error', 'Token not available. Please log in again.');
          return;
        }
    
        // Prepare the request payload
        const payload = {
          name,
          // Add other fields you want to update in the API request
    
          // Include password in the payload only if it's not empty
          ...(password && { password }),
        };
    
        // Make a PUT request to update the profile using Axios
        const response = await axios.put(
          'https://soundmatch-api.onrender.com/user/edit',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (response.status === 200) {
          // Profile updated successfully
          Alert.alert('Success', 'Profile updated successfully');
        } else {
          // Handle failed profile update or show error message
          Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
      } catch (error) {
        console.error('Error during profile update:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      }
    };
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          // Retrieve the access token from AsyncStorage
          const token = await AsyncStorage.getItem('token');
          console.log(token)
  
          if (token) {
            // Fetch user profile using the access token
            const response = await axios.get('https://soundmatch-api.onrender.com/user/profile', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
  
            const userData = response.data.user;
  
            // Set user data in state
            setName(userData.name);
            // You may choose not to pre-fill the password for security reasons
            // setPassword(userData.password);
          }
        } catch (error) {
          console.log('Error fetching user profile:', error);
        }
      };
  
      fetchUserProfile();
    }, []);
    const handleLogout = async () => {
      try {
        // Clear the access token from AsyncStorage
        await AsyncStorage.removeItem('token');
        // You may need to clear other user-related data from AsyncStorage
    
        // Navigate to the login screen or any screen that makes sense
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'LoadingPage' }],
          })
        );
      } catch (error) {
        console.error('Error during logout:', error);
        // Handle logout error if needed
      }
    };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Image source={require('../assets/backward.png')} style={styles.backArrowImage} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logout}
        onPress={handleLogout}
      >
        <Image source={require('../assets/logout.png')} style={styles.logoutImage} />
      </TouchableOpacity>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        {/* Profile Image */}
        <TouchableOpacity onPress={handleImageUpload}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/sound.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={{borderWith: 1,
              borderColor: COLORS.black,
              height: 52}}>
        <TouchableOpacity
            onPress={()=>{}}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              height: 52,
              borderWith: 1,
              borderColor: COLORS.black,
              marginRight: 4,
              borderRadius: 10
            }}>
            <Image
              source={require('../assets/spotify.png')}
              style={{marginRight: 8, width: 36, height: 36}}></Image>

            <Text style={{color: COLORS.black}}>Connect to your spotify account!</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom:12, marginTop:20}}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8,
                        color: COLORS.black
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
                            width: "100%",
                            color: COLORS.black
                        }}
                        value={name}
                        onChangeText={setName}/>
                    </View>
                    <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
              color:COLORS.black
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
              value={password}
              onChangeText={setPassword}
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
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
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
  logout: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  logoutImage: {
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
