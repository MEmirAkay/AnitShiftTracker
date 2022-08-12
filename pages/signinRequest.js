import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  
} from "react-native";
import axios from "axios";
import storage from "../component/storage";
import "react-native-reanimated";
import { MotiView } from "moti";
import * as Location from "expo-location";

import * as Device from "expo-device";

export default class SigninRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      identity_number: "",
      cntrl: false,
      navigation: props.navigation,
      deviceInfo: Device.brand + "-" + Device.modelId + "-" + Device.deviceName,
    };
  }
  _getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Permission not granted!");
      Alert.alert(
        "Uyarı",
        "Konum bilgisi alınamadı lüften konum hizmetinin açık olduğundan ve uygualamanın konum bilginizi kullanmasına izin verdiğinizden emin olun !",
        [
          {
            text: "Tamam",
            onPress: () => {
              status = Location.requestForegroundPermissionsAsync();
            },
          },
        ]
      );
    } else {
      try {
        storage
          .load({
            key: "loginState",
          })
          .catch((e) => {
            console.log(typeof e);
            
          })
          .then((e) => {
            console.log(e);

            if (typeof e !== "undefined") {
              axios.defaults.headers = {
                login_token: e.login_token,
                api_token: e.api_token,
              };

              axios.post(`/user?device=${this.state.deviceInfo}`).then((e) => {
              
                if(e.data.status == 1){
                  
                  this.state.navigation.replace("transactionSheet");
                }
              }).catch(()=>Alert.alert("Lütfen Tekrar Giriş Yapınız"))

            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  componentDidMount() {
    console.log(this.state.deviceInfo)
    this._getLocation();
  }
  Loading = () => {
    return (
      <View style={{ textAlign: "center", alignItems: "center" }}>
        <MotiView
          style={{
            width: 40,
            height: 40,
            borderRadius: 150 / 2,
            borderWidth: 150 / 20,
            borderColor: "#a6c9ff",
            shadowColor: "#a6c9ff",
            marginBottom: 10,
          }}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "timing",
            duration: 1000,
            repeat: Infinity,
          }}
        />
        <Text style={styles.wait}>Bekleyiniz..</Text>
      </View>
    );
  };

  verifyBtn() {
    axios
      .post(
        "/user/signin-request",
        `unique_code=${this.state.identity_number}`
      )
      .then((res) => {
        res = res.data;
        if (!res.status) {
          this.setState({ cntrl: false });
          return Alert.alert("Uyarı", res.message);
        }

        res.identity = this.state.identity_number;
        this.state.navigation.replace("signinVerify", res);
      })
      .catch((error) => {
        if (error) {
          return Alert.alert("Hata", error);
        } else {
          return Alert.alert("Uyarı !", "İnternet bağlantınızı kontrol edin !");
        }
      });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={styles.container}
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <Image style={{resizeMode:"contain" , width:120,height:120}}  source={require("../assets/u-crm.png")} />
          <StatusBar style="hidden" />
          <Text style={styles.login}>Cihaz Eşitle</Text>
          <Text style={styles.text}>
            Cihaz eşitlemek için ilk önce Personel Numaranızı giriniz
            ardından size verilecek kod ile giriş yapabilirsiniz.
          </Text>
          <TextInput
            style={styles.TextInput}
            maxLength={5}
            keyboardType="number-pad"
            placeholder="Personel Numaranızı Giriniz"
            placeholderTextColor="#aaaaaa"
            editable={!this.state.cntrl}
            onChangeText={(e) => this.setState({ identity_number: e })}
          />
          {this.state.cntrl &&
         
          typeof this.state.location == "undefined" ? (
            <this.Loading />
          ) : (
            <TouchableOpacity
              style={styles.btnContainer}
              
              onPress={() => {
                this.setState({ cntrl: true });
                this.verifyBtn();
              }}
            >
              <Text style={styles.btnText}>Kod Al</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
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
 
  TextInput: {
    backgroundColor: "#ffffff",
    width: "90%",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 15,
    padding: 15,
    fontSize: 20,
    margin: 20,
  },
  login: {
    fontWeight: "bold",
    fontSize: 26,
    margin: 20,
  },
  text: {
    fontSize: 15,
    margin: 20,
    textAlign: "center",
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
  wait: {
    color: "black",
    fontWeight: "bold",
  },
});
