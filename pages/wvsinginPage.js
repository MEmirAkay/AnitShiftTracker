import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

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
      <View style={styles.container}>
         <WebView
        style={{
          width:Dimensions.get('window').width
        }}
        source={{ uri: "http://api.ucrm.com.tr/webviews/signin.php" }}
      /> 
      
      <TouchableOpacity style={styles.returnBtn} onPress={()=>{this.state.navigation.replace("welcomePage")}}>
        <Text style={{ color: "#3b82ef", fontSize: 25, fontWeight: "bold" }}>
          Giriş Sayfasına Dön
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
      returnBtn: {
        alignItems: "center",
        justifyContent: "center",
        width: Dimensions.get("window").width - 30,
        borderRadius: 10,
        margin: 20,
        padding: 20,
        backgroundColor: "#a6c9ff",
      },
});
