import React from 'react';
import { Text, View, AsyncStorage, SectionList, Vibration, Platform, SafeAreaView } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import ReceivedItem from '../components/ReceivedItem';
import {ENDPOINT} from './../constants/Endpoint';

export default class AppContainer extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      expoPushToken: '',
      notification: {},
      newToys: [],
      toyHistory: []
    };

    this._isMounted = false;
  // rest of your code  
  } 


  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Possible error
      let token = await Notifications.getExpoPushTokenAsync();
      console.log("\nToken\n");
      console.log(token);
      this.setState(state => ({
        expoPushToken: token,
        newToys: [...state.newToys, token] // (possibly this.state.newToys) add token to new toys list (append to list)
      }))
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  componentDidMount() {
    this.registerForPushNotificationsAsync();

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    //this._toysSeen(this.state.newToys)
  }
  componentWillUnmount() {
    this._isMounted = false;
 }
  _handleNotification = notification => {
    Vibration.vibrate();
    console.log(notification);
    this.setState({ notification: notification });
  };

  /* 
  Takes a list of toy id's
  Updates toys as seen as soon as rendered
  */
  _toysSeen = async (toys_seen) => {
    if ( toys_seen == [] ) {
      return;
    }
    const endpoint = ENDPOINT + "toys_seen";
    fetch(endpoint, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_auth: await AsyncStorage.getItem("userToken"),
        toys: toys_seen
      })
    })
      .then(response => {
        if (response.status !== 200) {
          console.log('TOY has not been updated as seen')
          return;
        }
        else {
          console.log("response: " + response)
          // extract token
          response.json().then(responseJson => {
            if (responseJson.success) {
              console.log("TOY seen success")
            }
          });
        }
      })
      .catch(error => {
        console.log("fetch error: " + error);
      });
  }

  render() {
    return (
      <SafeAreaView>
          <SectionList
              sections={[
                {
                  title: 'New',
                  data: this.state.newToys,
                },
                {
                  title: 'History',
                  data: [],
                },
              ]}
              renderItem={({ item }) => ( <ReceivedItem contact={item}/> )}
              renderSectionHeader={({ section }) => (
                <Text style={{ fontSize: 20 }}>{section.title}</Text>
              )}
              keyExtractor={(item, index) => index}
            />
  
      </SafeAreaView>
    );
  }
}

/*  TO GET PUSH RECEIPTS, RUN THE FOLLOWING COMMAND IN TERMINAL, WITH THE RECEIPTID SHOWN IN THE CONSOLE LOGS

    curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/getReceipts" -d '{
      "ids": ["YOUR RECEIPTID STRING HERE"]
      }'


        <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Origin: {this.state.notification.origin}</Text>
          <Text>Data: {JSON.stringify(this.state.notification)}</Text>
        </View>
      </View> 
*/
