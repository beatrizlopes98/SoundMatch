import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import Register from './Register';
import Match from './Match';
import {Image, Linking} from 'react-native';

const Login = ({navigation}, props) => {
  const [isPasswordShown, setPasswordShown] = useState(true);
  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch('https://soundmatch-api.onrender.com/google');

      if (response.ok) {
        const responseData = await response.json();
        const {urlGoogle} = responseData;

        await Linking.openURL(urlGoogle)
      } else {
        console.error('Failed to fetch sign-in link');
      }
    } catch (error) {
      console.error('Error while fetching sign-in link:', error);
    }
  };
  const handleLogin = () => {
    // Perform login authentication here
    // Example: For demonstration purposes, directly setting isLoggedIn to true
    // Replace this with your actual authentication logic
    const isLoggedIn = true; // Assuming login is successful

    if (isLoggedIn) {
      // Navigate to the bottom tab navigator
      navigation.navigate('MainTabs');
    } else {
      // Handle failed login or show error message
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 0.7, marginHorizontal: 22}}>
        <View style={{flex: 1, marginHorizontal: 22}}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginVertical: 12,
              color: COLORS.black,
            }}>
            Welcome back!
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: COLORS.black,
            }}>
            Connecting Tunes and you!
          </Text>
        </View>
        <View style={{marginBottom: 12, marginTop: 0}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}>
            Email
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
              placeholder="Enter your email"
              placeholderTextColor={COLORS.black}
              keyboardType="email-adress"
              style={{
                width: '100%',
              }}
            />
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
              placeholder="Enter your name"
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
        <Button title="Login" color={COLORS.purple} onPress={handleLogin} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.black,
              marginHorizontal: 10,
            }}
          />
          <Text
            style={{
              fontSize: 14,
            }}>
            Or Login with
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.black,
              marginHorizontal: 10,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              height: 52,
              borderWith: 1,
              borderColor: COLORS.black,
              marginRight: 4,
              borderRadius: 10,
            }}>
            <Image
              source={require('../assets/google.png')}
              style={{marginRight: 8, width: 36, height: 36}}></Image>

            <Text>Google</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 22,
          }}>
          <Text style={{fontSize: 16, color: COLORS.black}}>
            Don't have an account?
          </Text>
          <Pressable
            onPress={() => {
              navigation.navigate('Register');
            }}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.purple,
                fontWeight: 'bold',
                marginLeft: 6,
              }}>
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
