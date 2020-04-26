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
                // Try .image  .rawImage   .thumbnail (deprecated, use Image)
                source={contact.imageAvailable != false ?
                    contact.image: 
                    require('./../assets/images/robot-dev.png')}
            />
            <Text style={styles.name}>{contact.firstName} </Text>
            <Text style={styles.name}>{contact.lastName} </Text>
        </View>
      </TouchableOpacity>
      );
    }

/* 
Send a 'Thinking of You' message. first try by sending a post request to server. If the contact does not have 
an account, offer to send the message with SMS
*/
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

/* 
Open up native SMS app with prefilled message to the contacts phone number
*/
async function withSMS(contact){
  const isAvailable = await SMS.isAvailableAsync();
  if (isAvailable) {
    SMS.sendSMSAsync(contact, "I was just thinking of you")
    .catch(err => {console.error("error sending sms")});
  } else {
    Alert.alert(
      "Message failed",
      "It seems your phone does not support in app SMS",
      [{text: 'OK', onPress: () => {}}],
      { cancelable: true }
    )
  }
}

/* 
Clean the phone number from the contacts list so that there are only digits, it is 10 digits long and the '1' 
in the beginning is removed
*/
function cleanPhoneNumber(phoneNumber){

  // to get primary .isPrimary returns a boolean   .digits returns a clean phone number
  // remove all non-digit chars and the first digit This is assuming that the numner starts with a 1
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
        flex: 1,
        alignSelf: 'center'
    },

    bubble: {
        flex: 1,
        margin: 5,
        minWidth: 50,
        maxWidth: 50,
        height: 50,
        maxHeight: 50,
        borderRadius: 10,
        // ^ change to 25 for circle
        backgroundColor: '#7B1FA2',
    }
  });
  