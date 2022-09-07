import axios from "axios";
import { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Pages
import SigninRequest from "./pages/signinRequest";
import SigninVerify from "./pages/signinVerify";
import transactionSheet from "./pages/transactionSheet";
import LandingPage from "./pages/landingPage";
import WelcomePage from "./pages/welcomePage";
import WvSigninPage from "./pages/wvsinginPage";

const Stack = createNativeStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    axios.defaults.baseURL = "https://api.ucrm.com.tr";
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="landingPage">
          
        <Stack.Screen
          name="landingPage"
          component={LandingPage}
          options={{
            title: null,
            header: () => null,
            gestureEnabled: "false"
          }}
          />
          <Stack.Screen
          name="wvsigninPage"
          component={WvSigninPage}
          options={{
            title: null,
            header: () => null,
            gestureEnabled: "false"
          }}
          />
        <Stack.Screen
          name="welcomePage"
          component={WelcomePage}
          options={{
            title: null,
            header: () => null,
            gestureEnabled: "false"
          }}
          />
          <Stack.Screen
            name="signinRequest"
            component={SigninRequest}
            options={{
              title: null,
              header: () => null,
              gestureEnabled: "false",
            }}
          />
          <Stack.Screen
            name="signinVerify"
            component={SigninVerify}
            options={{
              title: null,
              header: () => null,
              gestureEnabled: "false",
            }}
          />
          <Stack.Screen
            name="transactionSheet"
            component={transactionSheet}
            options={{
              title: null,
              header: () => null,
              gestureEnabled: "false",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
