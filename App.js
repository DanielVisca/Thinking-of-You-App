import * as React from "react";
import Expo from 'expo';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Text,
  Platform,
  Button
} from "react-native";
import * as Font from "expo-font";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import SendScreen from "./screens/SendScreen";
import ReceivedScreen from "./screens/ReceivedScreen";
import SignupScreen from './screens/SignupScreen';
import { TouchableOpacity } from "react-native-gesture-handler";
import { ENDPOINT } from './constants/Endpoint';
import { FirebaseConfig } from './constants/Secure';
import TabNavigator from "./navigation/TabNavigator";
// const ENDPOINT = 'http://127.0.0.1:8000/';
const AuthContext = React.createContext();

const Stack = createStackNavigator();

import { withPhoneAuth } from 'react-native-doorman'

import firebase from 'firebase/app'
import 'firebase/auth'

// 1. initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(FirebaseConfig)
}

// 3. give your app phone auth 🎉
export default withPhoneAuth(App, {
  doorman: {
    publicProjectId: 'dzqsypMVuESYoBPknW7a'
  }
})
					
function App({ navigation }) {
  const [_notificationSubscription, setNotificationCallback] = React.useState();
  const [notification, setNotification] = React.useState({});
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false
          };
        case "SIGN_IN":
          console.log("In SIGN_IN")
          console.log("previous state")
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_UP":
        console.log("In SIGN_UP")
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
        };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null
    }
  );

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        console.log("goting to set token")
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
        });

        userToken = await AsyncStorage.getItem("userToken");
        console.log("checking if user token is null ")
        console.log(userToken)
        notificationToken = await AsyncStorage.getItem("notificationToken");
        if (notificationToken == null) {
          console.log("userToken was null")
          registerForPushNotificationsAsync();
          setNotificationCallback(
            Notifications.addListener(_handleNotification)
          );
        } else {
          console.log("notification token: ", notificationToken);
        }
      } catch (e) {
        // Restoring token or loading fonts failed
        console.warn(e);
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      console.log("userToken: " + userToken)
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        AsyncStorage.setItem("userToken", data.user_auth_token);
        dispatch({ type: "SIGN_IN", token: data.user_auth_token });
      },
      signOut: () => {
        // alert back-end we're logging out
        AsyncStorage.getItem('userToken').then((userToken) => {
          console.log("--Logoff--")
          console.log(userToken)
          if(userToken){
            const endpoint = ENDPOINT + 'logoff'
            fetch(endpoint, {
              method: "post",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                authToken: userToken
              })
              }).then((response) => response.json())
                .catch((error) => {
                  console.error(error);
                })
                }
          });


        // remove out authToken
        AsyncStorage.removeItem("userToken");
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async data => {
        console.log("Signup")
        console.log(data.user_auth_token)
        AsyncStorage.setItem("userToken", data.user_auth_token)
        dispatch({ type: "SIGN_UP", token: data.user_auth_token });
      }
    }),
    []
  );

  function SplashScreen() {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  function LoginComponent(props) {
    return <Login {...props} nav={navigation} parentContext={authContext} />;
  }
  function SignupComponent(props) {
    return <SignupScreen {...props} nav={navigation} parentContext={authContext} />;
  }

  function HomeComponent() {
    return <HomeScreen parentContext={authContext} />;
  }

  function inAppComponent() {
    return <TabNavigator parentContext={authContext} />
  }

  function SendComponent() {
    return <SendScreen parentContext={authContext} />
  }
  function ReceivedComponent() {
    return <ReceivedScreen parentContext={authContext} />
  }


  function _handleNotification(notification) {
    //if you want to make the phone vibrate upon recieving notification
    // Vibration.vibrate();
    setNotification(notification);
    //dismisses notifications for android so they don't pop up, for iOS it is automatically dismissed
    if (Platform.OS == "android") {
      Notifications.dismissNotificationAsync(notification.notificationId);
    }
    console.log(notification);
  }

  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        
        <Stack.Navigator>
          {state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={LoginComponent}
              options={{
                headerShown: false,
                // When logging out, a pop animation feels intuitive
                // You can remove this if you want the default 'push' animation
                animationTypeForReplace: state.isSignout ? "pop" : "push"
              }}
            />
          ) : (
            // User is signed in
            <Stack.Screen 
              name="Home" 
              component={inAppComponent}
              options={{
                headerStyle: { backgroundColor: '#7B1FA2' },
                headerTitle: (
                  <Text style={{ color: '#fff', fontSize: 20 }}>Thinking of You</Text>
                ),
                headerTitleAlign: 'center',
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => { authContext.signOut() }}
                  ><Text style={{ color: '#fff', paddingRight: 15, fontSize: 20 }}>Logout</Text></TouchableOpacity>
                ),
              }} 
              />
          )}
          { state.userToken == null ? (

          <Stack.Screen
              name="SignUp"
              component={SignupComponent}
              options={{
                headerShown: false,
                animationTypeForReplace: state.isSignout ? "pop" : "push"
              }}
            />
          ) : (
            <Stack.Screen 
              name="Main" 
              component={inAppComponent}
              options={{
                headerStyle: { backgroundColor: '#7B1FA2' },
                headerTitle: (
                  <Text style={{ color: '#fff', fontSize: 20 }}>Thinking of You</Text>
                ),
                headerTitleAlign: 'center',
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => { authContext.signOut() }}
                  ><Text style={{ color: '#fff', paddingRight: 15, fontSize: 20 }}>Logout</Text></TouchableOpacity>
                ),
              }} 
              />
          )}
        </Stack.Navigator>
        
      </NavigationContainer>
    </AuthContext.Provider>
  );
}


async function registerForPushNotificationsAsync() {
  if (Constants.isDevice) {

    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    // const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    console.log("authorized for push notifications?")
    console.log(existingStatus)
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    await AsyncStorage.setItem("notificationToken", token);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
