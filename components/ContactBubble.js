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
            <Text>{contact.name}</Text>
        </View>
      );
    }

  const styles = StyleSheet.create({
    container: {
      padding: 20
    },

   bubble: {
        flex: 1,
        margin: 5,
        minWidth: 100,
        maxWidth: 100,
        height: 100,
        maxHeight: 104,
        backgroundColor: '#7B1FA2',
    }
  });
  