import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

export default class WelcomePage extends Component {
    constructor(props) {
        super(props);
        this.state={
            navigation: props.navigation,
        }
      }
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ resizeMode: "contain", marginBottom:100 ,width:180,height:180}}
          source={require("../assets/u-crm.png")}
        />

        <TouchableOpacity style={styles.registerBtn} onPress={()=>{this.state.navigation.replace("wvsigninPage")}}>
          <Text style={{ color: "white", fontSize: 25, fontWeight: "bold",color:"#3b82ef" }}>
            Kayıt Ol
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={()=>{this.state.navigation.replace("signinRequest")}}>
          <Text style={{ color: "white", fontSize: 25, fontWeight: "bold",color:"#02ba42"}}>
            Giriş Yap
          </Text>
        </TouchableOpacity>
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
  },

  btnContainer: {
    backgroundColor: "#a6c9ff",
    width: "90%",
    padding: 20,
    alignItems: "center",
    borderRadius: 15,
  },
  btnText: {
    color: "#3b82ef",
    fontWeight: "bold",
    fontSize: 20,
  },

  registerBtn: {
    elevation:5,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width / 2,
    borderRadius: 10,
    margin: 10,
    padding: 20,
    backgroundColor: "#a6c9ff",
  },
  loginBtn: {
    elevation:5,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width / 2,
    borderRadius: 10,
    margin: 10,
    padding: 20,
    backgroundColor: "#a6ffaf",
  },
});
