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
 


export default function ReceivedItem({toy})  { 
    console.log("ReceivedItem toy")
    console.log(toy)
    return (
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.container}>
            
            <Text> Item added</Text>
        </View>
      </TouchableOpacity>
      );
    }

    const styles = StyleSheet.create({
        container: {
          padding: 20
        },
    
        name : {
            flex: 1,
            alignSelf: 'center'
        }
      });
      