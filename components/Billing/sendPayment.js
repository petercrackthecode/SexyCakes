import React from "react";
import {
  StyleSheet,
  NativeModules,
  TextInput,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";

var StripeBridge = NativeModules.StripeBridge;

const makeOrder = async (amount, ccnumber, year, month, cvc) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({});

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const API = "https://spyd9htiua.execute-api.us-east-2.amazonaws.com/beta/";

  const client_secret = await fetch(API + amount.toString(), requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  StripeBridge.createPayment(
    client_secret,
    ccnumber,
    month,
    year,
    cvc,
    (error, res, payment_method) => {
      if (res == "SUCCESS") {
        this.setState({ loadingCardButton: false });
        Alert.alert("Sexy Cakes Payment", "Your Sexy Cakes payment succeeded", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    }
  );
};

class SendPayment extends React.Component {
  state = {
    loadingCardButton: false,
    ccname: "Maria Bernasconi",
    year: 22,
    ccnumber: 4242424242424242,
    month: 12,
    cvc: 123,
  };

  // event listener to update the values of the different inputs
  _onCCnumberChange = (text) => {
    this.setState({ ccnumber: text });
  };
  _onCCnameChange = (text) => {
    this.setState({ name: text });
  };
  _onCCmonthChange = (text) => {
    this.setState({ month: text });
  };
  _onCCyearChange = (text) => {
    this.setState({ year: text });
  };
  _onCCcvvChange = (text) => {
    this.setState({ cvc: text });
  };

  render() {
    return (
      <View style={{ paddingTop: 100, backgroundColor: "#1e1f34", flex: 1 }}>
        <View style={styles.flowRight}>
          <TextInput
            editable={true}
            style={styles.searchInput}
            autoCapitalize={"words"}
            keyboardType={"default"}
            placeholder="Name on card"
            onChangeText={(text) => this._onCCnameChange(text)}
            autoCorrect={false}
            multiLine={false}
            placeholderTextColor="#7a7d85"
            selectionColor="white"
            autoCompleteType="off"
            textContentType="none"
          />
        </View>
        <View style={styles.flowRight}>
          <TextInput
            editable={true}
            maxLength={16}
            style={styles.searchInput}
            keyboardType={"number-pad"}
            placeholder="Card Number"
            onChangeText={(text) => this._onCCnumberChange(text)}
            autoCorrect={false}
            multiLine={false}
            autoCapitalize={"none"}
            placeholderTextColor="#7a7d85"
            selectionColor="white"
            autoCompleteType="off"
            textContentType="none"
          />
        </View>
        <View style={styles.flowRight}>
          <TextInput
            maxLength={2}
            editable={true}
            style={styles.searchInput}
            keyboardType={"number-pad"}
            placeholder="MM"
            onChangeText={(text) => this._onCCmonthChange(text)}
            autoCorrect={false}
            multiLine={false}
            placeholderTextColor="#7a7d85"
            selectionColor="white"
            autoCompleteType="off"
            textContentType="none"
          />
          <TextInput
            maxLength={2}
            editable={true}
            style={styles.searchInput}
            keyboardType={"number-pad"}
            placeholder="YY"
            onChangeText={(text) => this._onCCyearChange(text)}
            autoCorrect={false}
            multiLine={false}
            placeholderTextColor="#7a7d85"
            selectionColor="white"
            autoCompleteType="off"
            textContentType="none"
          />
        </View>
        <View style={styles.flowRight}>
          <TextInput
            maxLength={3}
            editable={true}
            style={styles.searchInput}
            keyboardType={"number-pad"}
            placeholder="CVC"
            onChangeText={(text) => this._onCCcvvChange(text)}
            autoCorrect={false}
            multiLine={false}
            placeholderTextColor="#7a7d85"
            selectionColor="white"
            autoCompleteType="off"
            textContentType="none"
          />
        </View>

        {this.state.loadingCardButton ? (
          <View style={{ paddingTop: 50 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.blueButton}
            onPress={() => this.pay()}
          >
            <Text>Pay</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  blueButton: {
    marginTop: 50,
    height: 40,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    width: 300,
    backgroundColor: "#5ed9f5",
    borderWidth: 1,
    borderColor: "#5ed9f5",
    borderRadius: 0,
  },
  searchInput: {
    color: "white",
    height: 45,
    paddingLeft: 10,
    flex: 1,
    fontSize: 14,
    borderColor: "#48BBEC",
    backgroundColor: "#1e1f34",
  },
  flowRight: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#7a7d85",
  },
});

export default SendPayment;
