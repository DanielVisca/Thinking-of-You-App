import * as React from "react";
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
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ENDPOINT } from './constants/Endpoint';
// const ENDPOINT = 'http://127.0.0.1:8000/';
const AuthContext = React.createContext();

const Stack = createStackNavigator();

export default function App({ navigation }) {
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
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
        });

        userToken = await AsyncStorage.getItem("userToken");

        notificationToken = await AsyncStorage.getItem("notificationToken");
        if (notificationToken == null) {
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
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        //TODO: add User's name to be stored
        console.log("data")
        console.log(data)
        AsyncStorage.setItem("userToken", data.user_auth_token);
        dispatch({ type: "SIGN_IN", token: data.user_auth_token });
      },
      signOut: () => {
        // alert back-end we're logging out
        AsyncStorage.getItem('userToken').then((userToken) => {
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
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
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

  function LoginComponent() {
    return <Login parentContext={authContext} />;
  }

  function HomeComponent() {
    return <HomeScreen parentContext={authContext} />;
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
              component={HomeComponent}
              options={{
                headerStyle: { backgroundColor: '#f8962e' },
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
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  // only asks if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  // On Android, permissions are granted on app installation, so
  // `askAsync` will never prompt the user
  // Stop here if the user did not grant permissions
  if (status !== "granted") {
    alert("No notification permissions!");
    return;
  }

  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  await AsyncStorage.setItem("notificationToken", token);

  //TESTING SILENT NOTIFICATIONS
  const testInfo = {
    token: await AsyncStorage.getItem("notificationToken")
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
