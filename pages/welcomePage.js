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
    this.state = {
      navigation: props.navigation,
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            height: (Dimensions.get("window").height * 1) / 2,
            justifyContent: "flex-end",
          }}
        >
          <View style={{alignItems:"flex-end",flex:1}}>
          <Image
            style={{
              flex: 1,
              resizeMode: "contain",
              width: 225,
              height: 225,
            }}
            source={require("../assets/u-crm.png")}
          />
          </View>
          <View style={{justifyContent:"center", alignItems:"center"}}>
            <Text style={{fontSize:35, fontWeight:"500", fontStyle:"italic",color:"#999696"}}>
            µCRM PDKS
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "space-evenly",
            height: (Dimensions.get("window").height * 1) / 2,
          }}
        >
          <View
            style={{ height: (Dimensions.get("window").height * 1) / 8 }}
          ></View>
          <View style={{ height: (Dimensions.get("window").height * 1) / 8 }}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => {
                this.state.navigation.replace("signinRequest");
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 35,
                  fontWeight: "500",
                  color: "#02ba42",
                }}
              >
                Giriş Yap
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: (Dimensions.get("window").height * 1) / 8,
              marginBottom: 40,
            }}
          >
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => {
                this.state.navigation.replace("wvsigninPage");
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#3b82ef",
                }}
              >
                Kayıt Ol
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },

  registerBtn: {
    flex: 1,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width / 2,
    borderRadius: 10,
    margin: 0,
    padding: 0,
    backgroundColor: "none",
    borderWidth: 0,
    //borderColor: "#a6c9ff",
    // backgroundColor: "#a6c9ff",
  },
  loginBtn: {
    flex: 1,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    width: (Dimensions.get("window").width * 3) / 4,
    borderRadius: 10,
    margin: 10,
    padding: 20,
    backgroundColor: "#a6ffaf",
  },
});
