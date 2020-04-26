import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
// import HomeScreen from '../screens/HomeScreen';
// import LinksScreen from '../screens/LinksScreen';
import SendScreen from '../screens/SendScreen';
import ReceivedScreen from '../screens/ReceivedScreen';
const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Send';


export default function BottomTabNavigator(props) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  
  //navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  console.log("props")
  console.log(props)
  function SendComponent() {
    return <SendScreen parentContext={props.parentContext} />
  }
  
  function ReceivedComponent() {
    return <ReceivedScreen parentContext={parentContext} />
  }

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Send"
        component={SendComponent}
        options={{
          title: 'Send',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-send" />,
        }}
      />
      <BottomTab.Screen
        name="Received"
        component={ReceivedComponent}
        options={{
          title: 'Received',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-mail" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// function getHeaderTitle(route) {
//   const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

//   switch (routeName) {
//     case 'Home':
//       return 'How to get started';
//     case 'Links':
//       return 'Links to learn more';
//   }
// }
