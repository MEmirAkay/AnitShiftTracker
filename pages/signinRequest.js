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
import 'react-native-reanimated';
import { MotiView } from 'moti';


export default class SigninRequest extends Component {

  constructor(props) {
    super(props);

    this.state = {
      identity_number: "",
      cntrl: false,
      navigation: props.navigation
    }
  }

  componentDidMount() {
    storage.load({
      key: 'loginState',
    }).catch((e) => {
      console.log(typeof e);
    }).then((e) => {
      console.log(e)
      if (typeof (e) !== "undefined") {
        this.state.navigation.navigate('transactionSheet');
      }

    })
  }
  Loading = () => {
    return (
      <View style={{ textAlign: 'center', alignItems: 'center' }}>
        <MotiView

          style={{
            width: 40,
            height: 40,
            borderRadius: 150 / 2,
            borderWidth: 150 / 20,
            borderColor: '#a6c9ff',
            shadowColor: '#a6c9ff',
            marginBottom: 10,
          }}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: 'timing',
            duration: 1000,
            repeat: Infinity

          }}
        />
        <Text style={styles.wait}>Bekleyiniz..</Text>
      </View>
    );
  }
  setTcNo(e) {
    this.state.identity_number_verify = false;
    this.state.identity_number = e;
    this.setState({ identity_number: e });
    if (e.length === 11) {
      this.state.identity_number_verify = true;
    }
  }


  verifyBtn() {
    axios.post('/user/signin-request', `identity_number=${this.state.identity_number}`).then(res => {
      res = res.data;
      if (!res.status) {
        this.setState({ cntrl: false });
        return Alert.alert("Uyarı", res.message);
      }

      res.identity = this.state.identity_number;
      this.state.navigation.navigate('signinVerify', res);
    });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container} onPress={Keyboard.dismiss} accessible={false}>
          <Image style={styles.image} source={require("../assets/logo.png")} />
          <StatusBar style="hidden" />
          <Text style={styles.login}>Cihaz Eşitle</Text>
          <Text style={styles.text}>Cihaz eşitlemek için ilk önce T.C. Kimlik numaranızı giriniz
            ardından size verilecek kod ile giriş yapabilirsiniz.</Text>
          <TextInput
            style={styles.TextInput}
            maxLength={11}
            keyboardType='number-pad'
            placeholder="TC Kimlik Numaranızı Giriniz"
            placeholderTextColor="#aaaaaa"
            editable={!this.state.cntrl}
            onChangeText={e => this.setTcNo(e)}
          />
          {
            (this.state.cntrl && this.state.identity_number.length === 11 && typeof this.state.location == "undefined") ? (<this.Loading />) :
              (<TouchableOpacity
                style={styles.btnContainer}
                disabled={(this.state.identity_number.length === 11) ? false : true} onPress={() => {
                  this.setState({ cntrl: true });
                  this.verifyBtn();
                }}>
                <Text style={styles.btnText}>Kod Al</Text>
              </TouchableOpacity>)
          }
        </View>
        </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 200,
      height: 110
    },
    TextInput: {
      backgroundColor: '#ffffff',
      width: "90%",
      borderStyle: 'solid',
      borderWidth: 2,
      borderColor: '#ddd',
      borderRadius: 15,
      padding: 15,
      fontSize: 20,
      margin: 20,
    },
    login: {
      fontWeight: 'bold',
      fontSize: 26,
      margin: 20
    },
    text: {
      fontSize: 15,
      margin:20,
      textAlign: "center"
    },

    btnContainer: {
      backgroundColor: '#a6c9ff',
      width: "90%",
      padding: 20,
      alignItems: 'center',
      borderRadius: 15
    },
    btnText: {
      color: '#3b82ef',
      fontWeight: 'bold',
      fontSize: 20
    },
    wait: {
      color: 'black',
      fontWeight: 'bold',
    }
  })