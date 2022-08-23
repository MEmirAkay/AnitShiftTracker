
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
} from "react-native";
import storage from "../component/storage";
import axios from "axios";
export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state={
        navigation: props.navigation,
    }
  }

  componentDidMount() { // When page loaded this runs first
    try { // Checks storage to ensure tokens are there
        storage
          .load({
            key: "loginState",
          })
          .catch((e) => {
            if (typeof e == "undefined") {
              return;
            }
          })
          .then((e) => {
            if (typeof e !== "undefined") {
              axios.defaults.headers = { // If tokens does exist sets them as headers
                login_token: e.login_token,
                api_token: e.api_token,
              };
              this.state.navigation.replace("transactionSheet"); // If tokens does exist routes "transactionSheet"
            } else {
                this.state.navigation.replace("signinRequest")   // If tokens does not exist routes "signinRequest"
            }
          });
      } catch (error) {
        return;
      }   
  }


  render() {
    return (
      <View style={styles.container}>
        <Image
            style={{ resizeMode: "contain", width: 201, height: 200 }}
            source={require("../assets/u-crm.png")}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }
});
