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
import * as SMS from 'expo-sms';
import {ENDPOINT} from './../constants/Endpoint';
 


export default function ContactBubble({contact})  { 
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
    const phoneNumber = cleanPhoneNumber(contact.phoneNumbers[0].number)
    const endpoint = ENDPOINT + "send_toy";
    fetch(endpoint, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_auth: await AsyncStorage.getItem("userToken"),
        phone_number: phoneNumber
      })
    })
      .then(response => {
        if (response.status !== 200) {
          Alert.alert(
            contact.name + " does not have 'Thinking of you'",
            "Would you like to let them know via text instead?",
            [{text: 'OK', onPress: () => {withSMS(phoneNumber)}}],
            { cancelable: true }
          )
          return;
        }
        else {
          console.log("response: " + response)
          // extract token
          response.json().then(responseJson => {
            if (responseJson.success == false) {
              Alert.alert(
                "Failed to send",
                "It's us, not you. Blush",
                [{text: 'OK', onPress: () => {}}],
                { cancelable: true }
              )
            }
          });
        }
      })
      .catch(error => {
        console.log("fetch error: " + error);
        Alert.alert(
          "Failed to send",
          "It's us, not you. Blush",
          [{text: 'OK', onPress: () => {}}],
          { cancelable: true }
        )
      });
  }

async function withSMS(contact){
  const isAvailable = await SMS.isAvailableAsync();
  if (isAvailable) {
    // do your SMS stuff here
    SMS.sendSMSAsync(contact, "I was just thinking of you")
  } else {
    // misfortune... there's no SMS available on this device
    Alert.alert(
      "Message failed",
      "It seems your phone does not support SMS",
      [{text: 'OK', onPress: () => {}}],
      { cancelable: true }
    )
  }
}

function cleanPhoneNumber(phoneNumber){
// remove all non-digit chars
  let standardNo = phoneNumber.replace(/[^\d]/g,'').substr(1,)

  if(standardNo.length!= 10) {
      console.log("standardNo")
      console.log(standardNo)
      alert('non-standard number')
      return;
  }
  console.log("standardNo")
  console.log(standardNo)
  return standardNo
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
  