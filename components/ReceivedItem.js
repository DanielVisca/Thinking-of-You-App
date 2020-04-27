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
 


export default function ReceivedItem({contact})  { 
    return (
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.container}>
            <Image
                // Try .image  .rawImage   .thumbnail (deprecated, use Image)
                source={contact.imageAvailable != false ?
                    contact.image: 
                    require('./../assets/images/robot-dev.png')}
            />
            <Text style={styles.name}>{contact.name} </Text>
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
      