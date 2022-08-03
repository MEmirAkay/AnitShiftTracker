import { StatusBar } from "expo-status-bar";
import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  Button,
  FlatList,
  Image,
} from "react-native";
import storage from "../component/storage";
import "react-native-reanimated";
import { MotiView, SafeAreaView } from "moti";
import axios from "axios";
import * as Location from "expo-location";

export default class TransactionSheet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastEvent: "",
      locationStatus: 0,
      latitude: undefined,
      longitude: undefined,
      location: {},
      errorMessage: "",
      last10data: [],
      identity_number: null,
      identity_number_verify: false,
      username: "Kullanici",
    };
  }

  degistirMesai = (eventChange) => {
    this._getLocation();
    if (this.state.locationStatus == 1) {
      Alert.alert(
        "Uyarı !",
        "Lütfen konum verinizin açık olduğundan ve uygulamanın konum verinize erişimine izin verdiğinizden emin olun.",
        [
          {
            text: "Tamam",
          },
        ]
      );
    } else if (this.state.locationStatus == 0) {
      Alert.alert("Uyarı !", "Bu işlemi yapmak istediğinizden emin misiniz?", [
        {
          text: "Hayır",
        },
        {
          text: "Evet",
          onPress: () => {
            let latitude = this.state.latitude,
              longitude = this.state.longitude;
            axios
              .post(
                `/event?event_type=${eventChange}&latitude=${latitude}&longitude=${longitude}`
              )
              .then(() => {
                this.setState({ lastEvent: eventChange });
                this.son10Kayit();
              })
              .catch(() => {
                return Alert.alert(
                  "Uyarı !",
                  "İnternet bağlantınızı kontrol edin !"
                );
              });
          },
        },
      ]);
    }
  };

  son10Kayit() {
    axios
      .post("/event/list")
      .then((e) => this.setState({ last10data: e.data.list }))
      .catch(() => {
        return Alert.alert("Uyarı !", "İnternet bağlantınızı kontrol edin !");
      });
  }

  kontrolMesai = () => {
    storage
      .load({
        key: "loginState",
      })
      .then((e) => {
        this.setState({ username: e.name_surname });
        axios.defaults.headers = {
          login_token: e.login_token,
          api_token: e.api_token,
        };
        if (typeof e !== "undefined") {
          axios
            .post("/event/last")
            .then((res) => {
              res = res.data;
              if (res) {
                this.setState({ lastEvent: res });
              }
            })
            .catch(() => {
              return Alert.alert(
                "Uyarı !",
                "İnternet bağlantınızı kontrol edin !"
              );
            });
          this.son10Kayit();
        }
      });
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
      this.setState({ locationStatus: 1 });
    } else {
      await Location.getCurrentPositionAsync()
        .then((e) => {
          e = e.coords;
          typeof e.latitude !== "undefined"
            ? (this.setState({ latitude: JSON.stringify(e.latitude) }),
              this.setState({ longitude: JSON.stringify(e.longitude) }))
            : console.log("undefined");
          this.setState({ locationStatus: 0 });
        })
        .catch((e) => {
          console.log(e),
            Alert.alert(
              "Uyarı !",
              "Lütfen konum verinizin açık olduğundan ve uygulamaya konum verinize izin verdiğinize emin olun.",
              [
                {
                  text: "Tamam",
                },
              ]
            ),
            this._getLocation();
        });
    }
  };

  render() {
    const ItemView = ({ item }) => {
      return (
        <View style={{ width: Dimensions.get("window").width * 0.9 }}>
          <TouchableOpacity style={{ height: 30 }}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",

                alignItems: "center",
                borderBottomWidth: 0.5,
                borderTopWidth: 0.5,
                alignContent: "space-between",
              }}
            >
              {item.islem_tipi == "1" ? (
                <Text
                  style={{
                    flex: 1,
                    color: "black",
                    fontSize: 15,
                  }}
                >
                  Mesai Başla
                </Text>
              ) : (
                <Text
                  style={{
                    flex: 1,
                    color: "black",
                    fontSize: 15,
                  }}
                >
                  Mesai Bitir
                </Text>
              )}

              <Text
                style={{
                  flex: 1,
                  color: "black",
                  fontSize: 12,
                }}
              >
                {item.islem_tarihi}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <View>
          <StatusBar style="hidden" />
          {typeof this.state.latitude !== "undefined" ? (
            <View
              style={{
                felx: 1,

                alignItems: "center",
                alignContent: "center",
              }}
            >
              <View style={{ alignItems: "center", marginTop: 60 }}>
                <Image
                  style={{resizeMode:"contain" , width:120,height:120}}
                  source={require("../assets/u-crm.png")}
                />

              
                <Text style={{ fontSize: 20, paddingTop:20 }}>{this.state.username}</Text>
              </View>

              {this.state.lastEvent == 1 ? (
                <View>
                  <TouchableOpacity
                    style={styles.btnMesaiBitir}
                    onPress={() => {
                      this.degistirMesai(2);
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontSize: 20,
                      }}
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
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontSize: 20,
                      }}
                    >
                      Mesai Başla
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={{ flex: 1, flexDirection: "column", marginTop: 25 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text>İşlem</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text>İşlem Tarihi</Text>
                  </View>
                </View>

                <FlatList
                  style={{ flex: 1, marginTop: 5 }}
                  data={this.state.last10data}
                  renderItem={ItemView}
                  keyExtractor={(item) => item.id}
                />
              </View>

              <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => {
                  Alert.alert(
                    "Uyarı !",
                    "Bu işlemi yapmak istediğinizden emin misiniz?",
                    [
                      {
                        text: "Hayır",
                      },
                      {
                        text: "Evet",
                        onPress: () => {
                          storage.remove({
                            key: "loginState",
                          });
                          this.props.navigation.replace("signinRequest");
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.btnText}>Oturumu Sonlandır</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <this.Loading />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
    width: 180,
    height: 100,
  },
  btnMesaiBaşla: {
    backgroundColor: "#5cb85c",
    color: "#fff",
    marginTop: 20,
    padding: 20,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    borderRadius: 25,
    width: Dimensions.get("window").width * 0.8,
  },
  btnMesaiBitir: {
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#d9534f",
    color: "#fff",
    marginTop: 20,
    padding: 20,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    borderRadius: 25,
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
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#a6c9ff",
    padding: 10,
    margin: 20,
    alignItems: "center",
    borderRadius: 15,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.4,
  },
});
