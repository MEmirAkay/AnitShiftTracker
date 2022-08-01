import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import storage from "../component/storage";
import "react-native-reanimated";
import { MotiView } from "moti";
import axios from "axios";
import * as Location from "expo-location";
export default class TransactionSheet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastEvent: "",

      latitude: undefined,
      longitude: undefined,
      location: {},
      errorMessage: "",

      navigation: props.navigation,

      identity_number: null,
      identity_number_verify: false,
    };
  }

  degistirMesai = (eventChange) => {
    var latitude = this.state.latitude;
    var longitude = this.state.longitude;
    axios.post(
      `/event?event_type=${eventChange}&latitude=${latitude}&longitude=${longitude}`
    );
    this.kontrolMesai();
  };

  kontrolMesai = () => {
    storage
      .load({
        key: "loginState",
      })
      .then((e) => {
        if (typeof e !== "undefined") {
          axios.defaults.headers = {
            login_token: e.login_token,
            api_token: e.api_token,
          };
          axios.post("/event/last").then((res) => {
            res = res.data;
            if (res) {
              this.setState({ lastEvent: res });
            }
          });
        }
      })
      
  };

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

  componentDidMount() {
    this._getLocation();
    this.kontrolMesai();
  }

  _getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Permission not granted!");
      this.setState({ errorMessage: "Permission not granted!" });
    }

    await Location.getCurrentPositionAsync()
      .then((e) => {
        e = e.coords;
        typeof e.latitude !== "undefined"
          ? (this.setState({ latitude: JSON.stringify(e.latitude) }),
            this.setState({ longitude: JSON.stringify(e.longitude) }))
          : console.log("undefined");
      })
      .catch((e) => console.log(e));
  };

  render() {
    console.log(JSON.stringify(this.state.location.latitude));
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require("../assets/logo.png")} />
        <StatusBar style="auto" />
        {typeof this.state.latitude !== "undefined" ? (
          <View>
            {this.state.lastEvent == 1 ? (
              <View>
                <TouchableOpacity
                  style={styles.btnMesaiBitir}
                  onPress={() => {
                    this.degistirMesai(2);
                    this.kontrolMesai();
                  }}
                >
                  <Text
                    style={{ color: "#fff", textAlign: "center", fontSize: 20 }}
                  >
                    Mesai Bitir
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  style={styles.btnMesaiBaşla}
                  onPress={() => {
                    this.degistirMesai(1);
                    this.kontrolMesai();
                  }}
                >
                  <Text
                    style={{ color: "#fff", textAlign: "center", fontSize: 20 }}
                  >
                    Mesai Başla
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => {
                storage.remove({
                  key: "loginState",
                });
                
              }}
            >
              <Text style={styles.btnText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <this.Loading />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: '20%'
  },
  image: {
    marginBottom: 40,
    width: 180,
    height: 100,
  },
  btnMesaiBaşla: {
    backgroundColor: "#5cb85c",
    color: "#fff",
    padding: 30,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  btnMesaiBitir: {
    backgroundColor: "#d9534f",
    color: "#fff",
    padding: 30,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    borderRadius: 25,
    marginTop: 200,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  wait: {
    color: "black",
    fontWeight: "bold",
    marginTop: 10,
  },
  btnContainer: {
    backgroundColor: "#a6c9ff",
    padding:20,
    margin: 20,
    alignItems: "center",
    borderRadius: 15,
  },
});
