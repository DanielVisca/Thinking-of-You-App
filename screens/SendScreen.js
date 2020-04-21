import { GiftedChat } from "react-native-gifted-chat";

import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, 
    Platform, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    FlatList,
    SafeAreaView,
    AsyncStorage 
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ContactBubble from './../components/ContactBubble'
import { MonoText } from '../components/StyledText';
import * as Contacts from 'expo-contacts';
 








export default class SendScreen extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
        contacts: [],
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
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
            fields: [
                Contacts.Fields.PhoneNumbers
            ],
        });
        if (data.length > 0) {
            this.setState(state => ({
                contacts: data
            }))
        }
    }
}

render() {
    // const [selected, setSelected] = React.useState(new Map());
  
    // const onSelect = React.useCallback(
    //   id => {
    //     const newSelected = new Map(selected);
    //     newSelected.set(id, !selected.get(id));
  
    //     setSelected(newSelected);
    //   },
    //   [selected],
    // );
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                onEndReachedThreshold={0}
                onEndReached={({ distanceFromEnd }) => {
                console.debug('on end reached ', distanceFromEnd);
                }}
                contentContainerStyle={styles.list}
                data={this.state.contacts}
                renderItem={({ item }) => (
                    <ContactBubble
                        img={ item.imageAvailable ? item.image : null}
                        name={item.firstName}
                        contact={item}
                        // selected={!!selected.get(item.id)}
                        // onSelect={onSelect}
                    />
                )}
                keyExtractor={item => item.id}
                // extraData={selected}
            />
        
            <View style={styles.tabBarInfoContainer}>
            </View>
      </SafeAreaView>
    );
  }
  
}

SendScreen.navigationOptions = {
  header: null,
};

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
