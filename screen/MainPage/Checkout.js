import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Image,
  NativeModules,
  ScrollView,
  Alert
} from "react-native";
import {
  mobileStyles as styles,
  deviceHeight,
  deviceWidth,
  MAIN_THEME_COLOR,
} from "../../styles/mobile";
const algoliasearch = require("algoliasearch");
import {
  GlobalContextProvider,
  GlobalContext,
} from "../../components/Context/globalContext";
import { ProvideAuth, withAuth } from "../../components/Context/AuthContext";
import {
  Entypo,
  MaterialCommunityIcons,
  Foundation,
  AntDesign,
} from "@expo/vector-icons";
import { Login } from "../../components/Login/Login";
import { InstantSearch } from "react-instantsearch-native";

const roundToTwoDecimal = (num) => {
  return Math.ceil(num * 100) / 100;
};

var StripeBridge = NativeModules.StripeBridge;

export default function Checkout({ navigation }) {
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const makeOrder = (amount, ccnumber, year, month, cvc) => {
    var raw = JSON.stringify({});
  
    var requestOptions = {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: raw,
      redirect: "follow",
    };
  
    fetch(`https://spyd9htiua.execute-api.us-east-2.amazonaws.com/beta/?amount=${parseFloat(amount)}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.setupIntentId);

        StripeBridge.createPayment(
          responseJson.setupIntentId,
          ccnumber,
          month,
          year,
          cvc,
          (error, res, payment_method) => {
            if (res == 'SUCCESS') {
              
              Alert.alert('Stripe Payment', 'Your Stripe payment succeeded', [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ]);
            }
          },
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  const calculateSubTotal = (cart) => {
    let newSubTotal = 0;
    if (cart && Object.keys(cart).length !== 0) {
      Object.keys(cart).map((itemId) => {
        const price = cart[itemId].total;
        newSubTotal += price;
      });
    }

    newSubTotal = roundToTwoDecimal(newSubTotal);
    return newSubTotal;
  };

  const calculateTax = (subTotal) => {
    const TAX_RATE = 0.09;
    return roundToTwoDecimal(TAX_RATE * subTotal);
  };

  const [isLoginVisible, setIsLoginVisible] = useState(false);
  return (
    <withAuth.Consumer>
      {(authContext) => (
        <GlobalContext.Consumer>
          {(globalContext) => (
            <View
              style={{
                ...styles.fullPageContainer,
                justifyContent: "flex-start",
              }}
            >
              {authContext.isLoggedIn ? (
                <View
                  style={{
                    width: deviceWidth,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 10,
                      width: "80%",
                    }}
                  >
                    <Text
                      style={{
                        ...styles.titletext,
                        fontSize: deviceWidth * 0.07,
                      }}
                    >
                      Order Summary
                    </Text>
                    <Text style={{ ...styles.gridtext }}>
                      Subtotal: ${calculateSubTotal(globalContext.cart)}
                    </Text>
                    <Text style={{ ...styles.gridtext }}>
                      Tax: $
                      {calculateTax(calculateSubTotal(globalContext.cart))}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: deviceWidth * 0.05,
                      }}
                    >
                      Total: $
                      {calculateSubTotal(globalContext.cart) +
                        calculateTax(calculateSubTotal(globalContext.cart))}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginVertical: deviceHeight * 0.05,
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 10,
                      width: "80%",
                    }}
                  >
                    <Text
                      style={{
                        ...styles.titletext,
                        fontSize: deviceWidth * 0.07,
                      }}
                    >
                      Shipping Address:
                    </Text>
                    <Text style={styles.gridtext}>
                      {authContext.firstName} {authContext.lastName}
                    </Text>
                    <Text style={styles.gridtext}>
                      {authContext.address.street}, {authContext.address.city},{" "}
                      {authContext.address.zipCode}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginBottom: deviceHeight * 0.1,
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 10,
                      width: "80%",
                    }}
                  >
                    <Text
                      style={{
                        ...styles.titletext,
                        fontSize: deviceWidth * 0.07,
                      }}
                    >
                      Payment method:
                    </Text>
                    <Text style={styles.gridtext}>
                      {authContext.type}...
                      {authContext.ccnumber.substring(
                        authContext.ccnumber.length - 4
                      )}
                    </Text>
                    <Text style={styles.gridtext}>
                      {authContext.firstName} {authContext.lastName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 200,
                      backgroundColor: MAIN_THEME_COLOR,
                      alignItems: "center",
                      padding: 20,
                      borderRadius: 25,
                    }}
                    onPress= {() => makeOrder(calculateSubTotal(globalContext.cart) +
                        calculateTax(calculateSubTotal(globalContext.cart)), authContext.ccnumber, authContext.exp_year, authContext.exp_month, authContext.cvc)}
                  >
                    <Text>Place Orders</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: -deviceWidth * 0.2,
                  }}
                >
                  <Text style={{ fontSize: deviceWidth * 0.05 }}>
                    Login/Sign up to continue👇
                  </Text>
                  <TouchableOpacity
                    style={{ ...localStyles.button }}
                    onPress={() => {
                      setIsLoginVisible(true);
                    }}
                  >
                    <Text>Login/Sign up</Text>
                  </TouchableOpacity>
                  {isLoginVisible ? (
                    <Login setIsVisible={setIsLoginVisible} />
                  ) : null}
                </View>
              )}
            </View>
          )}
        </GlobalContext.Consumer>
      )}
    </withAuth.Consumer>
  );
}

const localStyles = StyleSheet.create({
  link: {
    width: "100%",
    padding: deviceHeight * 0.025,
  },
  avatar: {
    width: "100%",
    paddingVertical: deviceHeight * 0.025,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  profilePicture: {
    borderRadius: deviceWidth * 0.2,
    width: deviceWidth * 0.4,
    height: deviceWidth * 0.4,
  },
  button: {
    backgroundColor: MAIN_THEME_COLOR,
    borderRadius: deviceWidth * 0.05,
    padding: 10,
    marginTop: deviceHeight * 0.02,
  },
});
