import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
 
} from "react-native";

 


export default function ContactBubble({contact})  {
    console.log("contact")
    console.log(contact)
    console.log("\n")
    
    return (
        <View style={styles.container}>
            <Image style={styles.bubble}
                source={contact.imageAvailable != false ? 
                    contact.image : 
                    require('./../assets/images/robot-dev.png')}
            />
            <Text style={styles.name}>{contact.name.substr(0,8)} </Text>
        </View>
      );
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
  