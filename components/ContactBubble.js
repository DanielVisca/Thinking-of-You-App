import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from "react-native";
import {ENDPOINT} from './../constants/Endpoint';
 


export default function ContactBubble({contact})  {
    console.log("contact")
    console.log(contact)
    console.log("\n")
    
    return (
    
      <TouchableOpacity onPress={() => {sendTOY(contact)}}>
        <View style={styles.container}>
            <Image style={styles.bubble}
                source={contact.imageAvailable != false ? 
                    contact.image : 
                    require('./../assets/images/robot-dev.png')}
            />
            <Text style={styles.name}>{contact.name.substr(0,8)} </Text>
        </View>
      </TouchableOpacity>
      );
    }

async function sendTOY(contact) {
    const endpoint = ENDPOINT + "send_toy";
    fetch(endpoint, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_auth: await AsyncStorage.getItem("user_auth_token"),
        phone_number: contact.phoneNumbers[0].number
      })
    })
      .then(response => {
  
        if (response.status !== 200) {
          Alert.alert(
            "Failed to send",
            "It's us, not you. Blush",
            [{text: 'OK', onPress: () => {}}],
            { cancelable: true }
          )
          return;
        } else {
          console.log("response: " + response)
          // extract token
          response.json().then(responseJson => {
            if (responseJson.success == false) {
              console.log("the server didnt process the sent TOY properly. Return status 200 but failed to succeed")
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

    name : {
        flex: 1
    },

    bubble: {
        flex: 1,
        margin: 5,
        minWidth: 50,
        maxWidth: 50,
        height: 50,
        maxHeight: 50,
        borderRadius: 25,
        backgroundColor: '#7B1FA2',
    }
  });
  