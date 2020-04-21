import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';

import LoginForm from '../components/LoginForm'

// Used this guide to help create login components: https://stacktips.com/tutorials/react/creating-login-screen-in-react-native

export default function Login(props) {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <KeyboardAvoidingView behavior="position">
          <View style = {styles.backgroundContainer}>
            </View>
            <View >
              <Text style={styles.loginText}>Login</Text>
              <LoginForm parentContext={props.parentContext} />
            </View>
        </KeyboardAvoidingView >
        <Text style={styles.forgotPassText}>Forgot Password?</Text>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.signUpButtonContainer}>
                <Text style={styles.buttonText}>SIGN UP</Text>
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