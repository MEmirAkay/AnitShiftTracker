import axios from "axios";
import { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


//Pages
import SigninRequest from "./pages/signinRequest";
import SigninVerify from "./pages/signinVerify";
import transactionSheet from "./pages/transactionSheet";

const Stack = createNativeStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    axios.defaults.baseURL = 'https://api.ucrm.com.tr';
  }

  render() {
    return (
      <NavigationContainer >
        <Stack.Navigator >
          <Stack.Screen
          name="signinRequest" 
          component={SigninRequest} 
          options={{
            title: null,
            header: () => null,
          }} />
          <Stack.Screen name="signinVerify" component={SigninVerify} options={{ title: null, header: () => null, gestureEnabled:'false'}} />
          <Stack.Screen name="transactionSheet" component={transactionSheet} options={{ title: null, header: () => null, gestureEnabled:'false'}} />
          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
