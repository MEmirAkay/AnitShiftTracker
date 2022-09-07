import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";


import { WebView } from "react-native-webview";
export default class WvSigninPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
    };
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{alignItems:"flex-start", width:Dimensions.get("window").width}}>
          <TouchableOpacity
            style={styles.returnBtn}
            onPress={() => {
              this.state.navigation.replace("welcomePage");
            }}
          >
            <AntDesign name="back" size={25} color="black"/>
            <Text style={{fontSize:20, marginLeft:5}}>
              
              Geri
            </Text>
          </TouchableOpacity>
        </View>

        <WebView
          style={{
            width: Dimensions.get("window").width,
          }}
          source={{ uri: "http://api.ucrm.com.tr/webviews/signin.php" }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop:10,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  returnBtn: {
    flexDirection:'row',
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: Dimensions.get("window").width / 4,
    borderRadius: 10,
    margin: 20,
    padding: 10,
    backgroundColor: "#dfe1e8",
  },
});
