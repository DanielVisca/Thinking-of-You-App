import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from "react-native";
import { ENDPOINT } from './../constants/Endpoint';

export default class LoginForm extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          onSubmitEditing={() => this.passwordInput.focus()}
          autoCorrect={false}
          keyboardType="number-pad"
          returnKeyType="next"
          placeholder="Phone Number"
          autoCorrect={false}
          placeholderTextColor="#a6a6a6"
          onChangeText={text => this.setState({ phone_number: text })}
        />

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          returnKeyType="go"
          ref={input => (this.passwordInput = input)}
          placeholder="Password"
          placeholderTextColor="#a6a6a6"
          secureTextEntry
          onChangeText={text => this.setState({ pass: text })}
        />

        <TouchableOpacity
          style={styles.loginButtonContainer}
          onPress={() => {
            if (
              this.state == null ||
              this.state.phone_number == null ||
              this.state.pass == null ||
              this.state.phone_number == "" ||
              this.state.pass == ""
            ) {
              Alert.alert(
                "Invalid Login Information",
                "No phone number or password",
                [{text: 'OK', onPress: () => {}}],
                { cancelable: true }
              )
              return;
            }
            authUser(
              this.state.phone_number,
              this.state.pass,
              this.props.parentContext.signIn
            );
            this.setState({ pass: "" });
          }}
        >
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

async function authUser(usr, pass, callback) {
  const loginInfo = {
    phone_number: usr,
    password: pass,
    token: await AsyncStorage.getItem("notificationToken")
  };
  //TODO: fill in with proper endpoint for API call:
  // current endpoint for testing. Username: 'eve.holt@reqres.in' Password: 'cityslicka'
  const endpoint = ENDPOINT + "init";
  // Fetch login request from the server
  fetch(endpoint, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginInfo)
  })
    .then(response => {
      if (response.status == 401) {
        Alert.alert(
          "Invalid Login Information",
          "Incorrect phone_number Address or Password",
          [{text: 'OK', onPress: () => {}}],
          { cancelable: true }
        )
        return
      }

      if (response.status !== 200) {
        Alert.alert(
          "Login Failed",
          "The login attempt has failed. Please try again later",
          [{text: 'OK', onPress: () => {}}],
          { cancelable: true }
        )
        return;
      } else {
        console.log("response: " + response)
        // extract token
        response.json().then(responseJson => {
          callback(responseJson);
        });
      }
    })
    .catch(error => {
      console.log("fetch error: " + error);
    });
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    height: 40,
    marginBottom: "5%",
    padding: 10,
    borderBottomColor: "#7B1FA2",
    borderBottomWidth: 1, 
    fontSize: 20
  },
  loginButtonContainer: {
    backgroundColor: "#7B1FA2",
    paddingVertical: 10,
    width: 250,
    marginTop: "5%",
    borderRadius: 50,
    alignSelf: 'center'
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "200",
    fontSize: 20
  }
});
