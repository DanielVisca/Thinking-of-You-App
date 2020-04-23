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

export default class SignupForm extends Component {

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          onSubmitEditing={() => this.password1Input.focus()}
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
          onSubmitEditing={() => this.password2Input.focus()}
          returnKeyType="go"
          ref={input => (this.password1Input = input)}
          placeholder="Password"
          placeholderTextColor="#a6a6a6"
          secureTextEntry
          onChangeText={text => this.setState({ pass1: text })}
        />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          returnKeyType="go"
          ref={input => (this.password2Input = input)}
          placeholder="Retype Password"
          placeholderTextColor="#a6a6a6"
          secureTextEntry
          onChangeText={text => this.setState({ pass2: text })}
        />

        <TouchableOpacity
          style={styles.loginButtonContainer}
          onPress={() => {
            console.log("this.state")
            console.log(this.state)
            if (
              this.state == null ||
              this.state.phone_number == null ||
              this.state.pass1 == null ||
              this.state.pass2 == null ||
              this.state.phone_number == "" ||
              this.state.pass1 == "" ||
              this.state.pass2 == ""
            ) {
              Alert.alert(
                "Invalid Login Information",
                "No phone number or password",
                [{text: 'OK', onPress: () => {}}],
                { cancelable: true }
              )
              return;
            }
            if ( this.state.pass1 !== this.state.pass2) {
                this.password1Input = ""
                this.password2Input = ""
                Alert.alert(
                "Invalid Login Information",
                "Your Passwords did not match",
                [{text: 'OK', onPress: () => {}}],
                { cancelable: true }
              )
              return;
            }
            authUser(
              this.state.phone_number,
              this.state.pass1,
              this.props.parentContext.signUp
            );
            this.setState({ 
                pass1: "",
                pass2: "" 
                });
          }}
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

async function authUser(usr, pass, callback) {
  const signupInfo = {
    phone_number: usr,
    password: pass,
    token: await AsyncStorage.getItem("notificationToken")
  };
  const endpoint = ENDPOINT + "signup";
  // Fetch login request from the server
  fetch(endpoint, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(signupInfo)
  })
    .then(response => {
    // // Add some checks and exceptions 
    //   if (response.status == 401) {
    //     Alert.alert(
    //       "Invalid Signup Information",
    //       "Incorrect phone_number Address or Password",
    //       [{text: 'OK', onPress: () => {}}],
    //       { cancelable: true }
    //     )
    //     return
    //   }

      if (response.status !== 200) {
        Alert.alert(
          "Signup Failed",
          "The signup attempt has failed. Please try again later",
          [{text: 'OK', onPress: () => {}}],
          { cancelable: true }
        )
        return;
      } else {
        response.json().then(responseJson => {
            console
            if (responseJson.success){
                // extract toke
                callback(responseJson);
            }
            else {
                Alert.alert(
                    "Signup Failed",
                    responseJson.msg,
                    [{text: 'OK', onPress: () => {}}],
                    { cancelable: true }
                )
                return;
            }
            
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
