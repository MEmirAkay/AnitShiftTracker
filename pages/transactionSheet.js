import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import storage from "../component/storage";
import "react-native-reanimated";
import { MotiView, SafeAreaView } from "moti";
import axios from "axios";
import * as Location from "expo-location";
import * as Network from "expo-network";
import * as Device from "expo-device";
import { Ionicons } from '@expo/vector-icons'; 

export default class TransactionSheet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingStatus: 0,
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
      deviceInfo: Device.brand + "-" + Device.modelId + "-" + Device.deviceName,
    };
  }

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
          customer_number: e.customer_number,
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
            borderColor: "#99f0c6",
            shadowColor: "#99f0c6",
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
        <Text style={styles.wait}>Lütfen Bekleyin..</Text>
      </View>
    );
  };

  componentDidMount() {
    try {
      // Checks storage to ensure tokens are there
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
            axios.defaults.headers = {
              // If tokens does exist sets them as headers
              login_token: e.login_token,
              api_token: e.api_token,
              customer_number: e.customer_number,
            };
            axios
              .post(`/user?device=${this.state.deviceInfo}`)
              .then((e) => {
                if (e.data.status == "1") {
                  return;
                } else {
                  storage.remove({ key: "loginState" });
                  Alert.alert("Uyarı", "Oturumunuz sonlandırıldı", [
                    {
                      text: "Tamam",
                      onPress: () => {
                        this.props.navigation.replace("welcomePage");
                      },
                    },
                  ]);
                }
              })
              .catch((err) => {
                console.log(err);
              });

            this.kontrolMesai();
            return;
          } else {
            this.props.navigation.replace("welcomePage"); // If tokens does not exist routes "signinRequest"
          }
        });
    } catch (error) {
      return;
    }
  }

  _getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Uyarı!",
        "Konum verisi alınamadı.\nMesai değişimi yapılamaz.",
        [
          {
            text: "Tamam",
          },
        ]
      );

      this.setState({ errorMessage: "Permission not granted!" });
      this.setState({ locationStatus: 0 });
      this.setState({ loadingStatus: 0 });
    } else {
      await Location.getCurrentPositionAsync()
        .then((e) => {
          e = e.coords;
          typeof e.latitude !== "undefined"
            ? (this.setState({ latitude: JSON.stringify(e.latitude) }),
              this.setState({ longitude: JSON.stringify(e.longitude) }),
              this.setState({ locationStatus: 1 }))
            : console.log("undefined");
        })
        .catch(() => {
          this.setState({ locationStatus: 0 });
          Alert.alert(
            "Uyarı !",
            "Konum verisi alınamadı.\nMesai değişimi yapılamaz.",
            [
              {
                text: "Tamam",
              },
            ]
          );
          this.setState({ loadingStatus: 0 });
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
                  GÜNE BAŞLA
                </Text>
              ) : (
                <Text
                  style={{
                    flex: 1,
                    color: "black",
                    fontSize: 15,
                  }}
                >
                  GÜNÜ BİTİR
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
          {this.state.loadingStatus !== 1 ? (
            <View
              style={{
                felx: 1,
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <View style={{width: Dimensions.get("window").width * 0.8, alignItems:"center"}}>
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
                            storage.remove({ key: "loginState" });
                            this.props.navigation.replace("welcomePage");
                          },
                        },
                      ]
                    );
                  }}
                  
                ><View>
                  <Ionicons name="exit-outline" size={34} color="white" />
                </View>
                <View>
                  <Text style={styles.btnText}>Oturumu Sonlandır</Text>
                </View>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "center", marginTop: 60 }}>
                <Image
                  style={{ resizeMode: "contain", width: 120, height: 120 }}
                  source={require("../assets/u-crm.png")}
                />

                <Text style={{ fontSize: 35,marginVertical:30 ,fontWeight:"300"}}>
                  {this.state.username}
                </Text>
              </View>

              {this.state.lastEvent == 1 ? (
                <View>
                  <TouchableOpacity
                    style={styles.btnMesaiBitir}
                    onPress={() => {
                      Network.getNetworkStateAsync()
                        .then((e) => {
                          if (e.isConnected === true) {
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
                                    this.setState({ loadingStatus: 1 });
                                    this._getLocation()
                                      .then(() => {
                                        let latitude = this.state.latitude;
                                        let longitude = this.state.longitude;
                                        if (this.state.locationStatus == 1) {
                                          axios
                                            .post(
                                              `/event?event_type=${2}&latitude=${latitude}&longitude=${longitude}`
                                            )
                                            .then(() => {
                                              this.setState({ lastEvent: 2 });
                                              this.son10Kayit();
                                              this.setState({
                                                loadingStatus: 0,
                                              });
                                            })
                                            .catch(() => {
                                              return Alert.alert(
                                                "Uyarı !",
                                                "İnternet bağlantınızı kontrol edin !",
                                                this.setState({
                                                  loadingStatus: 0,
                                                })
                                              );
                                            });
                                        }
                                      })
                                      .catch(() => {
                                        Alert.alert(
                                          "İşlem başarısız\nKonum verisi alınamadı\nLütfen konum verinizi açın"
                                        );
                                        this.setState({ loadingStatus: 0 });
                                      });
                                  },
                                },
                              ]
                            );
                          } else {
                            this.setState({ loadingStatus: 0 });
                            Alert.alert(
                              "Bağlantı hatası",
                              "İnternet bağlantınızı kontrol edin."
                            );
                          }
                        })
                        .catch(() => {
                          return Alert.alert(
                            "Bağlantı hatası",
                            "İnternet bağlantınızı kontrol edin."
                          );
                        });
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "900",
                      }}
                    >
                      GÜNÜ BİTİR
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    style={styles.btnMesaiBaşla}
                    onPress={() => {
                      Network.getNetworkStateAsync()
                        .then((e) => {
                          if (e.isConnected === true) {
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
                                    this.setState({ loadingStatus: 1 });
                                    this._getLocation()
                                      .then(() => {
                                        if (this.state.locationStatus == 1) {
                                          let latitude = this.state.latitude;
                                          let longitude = this.state.longitude;
                                          axios
                                            .post(
                                              `/event?event_type=${1}&latitude=${latitude}&longitude=${longitude}`
                                            )
                                            .then(() => {
                                              this.setState({ lastEvent: 1 });
                                              this.son10Kayit();
                                              this.setState({
                                                loadingStatus: 0,
                                              });
                                            })
                                            .catch(() => {
                                              return Alert.alert(
                                                "Uyarı !",
                                                "İnternet bağlantınızı kontrol edin !",
                                                this.setState({
                                                  loadingStatus: 0,
                                                })
                                              );
                                            });
                                        }
                                      })
                                      .catch(() => {
                                        Alert.alert(
                                          "İşlem başarısız\nKonum verisi alınamadı\nLütfen konum verinizi açın"
                                        );
                                        this.setState({ loadingStatus: 0 });
                                      });
                                  },
                                },
                              ]
                            );
                          } else {
                            Alert.alert(
                              "Bağlantı hatası",
                              "İnternet bağlantınızı kontrol edin."
                            );
                          }
                        })
                        .catch(() => {
                          return Alert.alert(
                            "Bağlantı hatası",
                            "İnternet bağlantınızı kontrol edin."
                          );
                        });
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "900",
                      }}
                    >
                      GÜNE BAŞLA
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
  btnMesaiBaşla: {
    backgroundColor: "#88db88",
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
    backgroundColor: "#ed6b78",
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
    flexDirection:"row",
    justifyContent:"space-evenly",
    width: Dimensions.get("window").width * 0.6,
    backgroundColor: "#c5cddb",
    padding: 5,
    margin: 5,
    alignItems: "center",
    borderRadius: 15,
  },
});
