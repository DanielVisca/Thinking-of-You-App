import { GiftedChat } from "react-native-gifted-chat";

import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, 
    Platform, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    AsyncStorage 
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import * as Contacts from 'expo-contacts';
 








export default class SendScreen extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
        contacts: [],
        searchPlaceholder: "Search"
    }
  }
  
  /* 
  call this on load
  */
async componentDidMount() {
    this._getContacts()
    
  }

  componentWillUnmount(){

  }



async _getContacts(){
    let context = this;
    try {
        let contacts = await AsyncStorage.getItem('contacts');
        if (contacts != null){
            console.log("in if \n")
            console.log(contacts)
            this.setState(state => ({
                contacts: contacts
            }))
        }
        else {
            // request access to contacts
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [
                        Contacts.Fields.PhoneNumbers
                    ],
                });
                console.log("in else \n")
                console.log(data)
                if (data.length > 0) {
                    AsyncStorage.setItem("contacts", data);
                    this.setState(state => ({
                        contacts: data
                    }))
                }
            }
        }
    } catch (error) {
        console.error(error)
      // Error retrieving data
    }
}


//   async _getContacts () {
//     contacts = await AsyncStorage.getItem("contacts");
//     console.log("contacts")
//     console.log(contacts)
//   }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text> IN SEND SCREEN</Text>
          </View>
        </ScrollView>
  
        <View style={styles.tabBarInfoContainer}>
        </View>
      </View>
    );
  }
  
}

SendScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development
        tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  sendScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
