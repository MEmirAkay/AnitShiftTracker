import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import storage from "../component/storage";
import "react-native-reanimated";
import { MotiView } from "moti";
import * as Device from "expo-device";

export default class SignInVerify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      verifyCode: "",
      cntrl: false,
      navigation: props.navigation,
      params: props.route.params,
      deviceInfo: Device.brand + "-" + Device.modelId + "-" + Device.deviceName,

      identity: props.route.params.identity,
      timer: props.route.params.timeout,
    };
  }

  verifyBtn() {
    axios
      .post(
        "/user/signin",
        `identity_number=${this.state.identity}&verify_code=${this.state.verifyCode}&device=${this.state.deviceInfo}`
      )
      .then((res) => {
        res = res.data;
        if (!res.status) {
          this.setState({ cntrl: false });
          return Alert.alert("Uyarı", res.message);
        }
        storage.save({
          key: "loginState",
          data: {
            api_token: res.user.api_token,
            login_token: res.user.login_token,
            name_surname: res.user.name_surname,
          },
        });
        this.state.navigation.replace("transactionSheet", res);
      })
      .catch(() => {
        return Alert.alert("Uyarı !", "İnternet bağlantınızı kontrol edin !");
      });
  }

  componentDidMount() {
    this.interval = setInterval(
      () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
      1000
    );
  }

  componentDidUpdate() {
    if (this.state.timer != 0) return;

    clearInterval(this.interval);
    Alert.alert(
      "Tekrar deneyiniz.",
      "Onay kodunu girmek için size ayrılan süre bitti."
    );
    this.state.navigation.replace("signinRequest");
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
            marginTop: 15,
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

  calcTime(time) {
    if (time < 1) return;
    let addZero = (t) => (t.toString().length == 1 ? `0` : "") + t;
    const h = Math.floor(time / 3600),
      m = Math.floor((time % 3600) / 60),
      s = Math.floor((time % 3600) % 60);
    return `${addZero(h)}:${addZero(m)}:${addZero(s)}`;
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Image style={{resizeMode:"contain" , width:120,height:120}} source={require("../assets/u-crm.png")} />
          <StatusBar style="auto" />
          <Text style={styles.login}>Giriş Yap</Text>
          <Text style={styles.text}>
            Yetkili ekibimizle iletişime geçerek adınıza gelen kodu
            alabilirsiniz.
          </Text>

          <View style={styles.signInVerify}>
            <TextInput
              style={styles.TextInput}
              maxLength={8}
              keyboardType="number-pad"
              placeholder="Aktivasyon Kodu"
              placeholderTextColor="#aaaaaa"
              onChangeText={(e) => {
                this.setState({ verifyCode: e });
              }}
            />
            <Text style={styles.clock}>{this.calcTime(this.state.timer)}</Text>
          </View>

          {this.state.cntrl && this.state.verifyCode.length === 8 ? (
            <this.Loading />
          ) : (
            <TouchableOpacity
              style={styles.btnContainer}
              disabled={this.state.verifyCode.length === 8 ? false : true}
              onPress={() => {
                this.setState({ cntrl: true });
                this.verifyBtn();
              }}
            >
              <Text style={styles.btnText}>Giriş Yap</Text>
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
    paddingBottom: 180,
  },
  
  TextInput: {
    backgroundColor: "#ffffff",
    width: "55%",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 15,
    padding: 17,
    fontSize: 20,
  },
  login: {
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    marginBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },

  btnContainer: {
    backgroundColor: "#a6c9ff",
    width: "90%",
    padding: 20,
    marginVertical: 20,
    alignItems: "center",
    borderRadius: 15,
  },
  btnText: {
    color: "#3b82ef",
    fontWeight: "bold",
    fontSize: 17,
  },
  clock: {
    flex: 1,
    marginLeft: 35,
    fontSize: 20,
    fontWeight: "bold",
  },
  signInVerify: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginLeft: 20,
  },
  wait: {
    color: "black",
    fontWeight: "bold",
    marginTop: 10,
  },
});
