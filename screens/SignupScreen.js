import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';

import SignupForm from '../components/SignupForm'

// Used this guide to help create login components: https://stacktips.com/tutorials/react/creating-login-screen-in-react-native

export default function Signup(props) {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <KeyboardAvoidingView behavior="position">
          <View style = {styles.backgroundContainer}>
            </View>
            <View >
              <Text style={styles.loginText}>Sign up</Text>
              <SignupForm parentContext={props.parentContext} />
            </View>
          </KeyboardAvoidingView>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.signUpButtonContainer} 
            onPress={() => { props.navigation.navigate("SignIn"); }}>
                <Text style={styles.buttonText}>Back to LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1
  },
  topContainer: {
    flex: 9,
    backgroundColor: '#ffffff'
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  logoContainer: {
    alignItems: 'flex-end',
    top: '25%',
  },
  logo: {
    width: 170,
    height: 60
    },
  loginText:{
    color: '#7B1FA2',
    marginTop: '50%',
    paddingLeft: 10,
    fontWeight: '200',
    fontSize: 35
  },
  signUpButtonContainer: {
    backgroundColor: "#7B1FA2",
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    width: '100%',
    height: 50,
    bottom: 0
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "300",
    fontSize: 20
  },
  forgotPassText: {
    color: "#7B1FA2",
    marginTop: 10,
    alignSelf: 'center',
    fontWeight: '300',
    fontSize: 20
  }
});