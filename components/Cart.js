import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import {
  mobileStyles as styles,
  deviceHeight,
  deviceWidth,
  MAIN_THEME_COLOR,
} from "../styles/mobile";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  faChevronDown,
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import {
  GlobalContextProvider,
  GlobalContext,
} from "../components/Context/globalContext";
import { InstantSearch } from "react-instantsearch-native";

const TAX_RATE = 0.09;

function Card({ itemId, calculateSubTotal }) {
  return (
    <GlobalContext.Consumer>
      {(context) => {
        const { item, amount, size, color } = context.cart[itemId];
        return (
          <View style={{ ...localStyles.card }}>
            <Image
              source={{
                uri: Array.isArray(item.images) ? item.images[0] : item.images,
              }}
              resizeMode="contain"
              style={localStyles.image}
            />
            <Text>${item.price}</Text>
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <View
              style={{
                ...styles.rowContainer,
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (amount > 1) {
                    const newItem = context.cart[itemId];
                    --newItem.amount;
                    context.setGlobalState({
                      ...context,
                      cart: {
                        ...context.cart,
                        [itemId]: newItem,
                      },
                    });
                    calculateSubTotal(context.cart);
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={faMinus}
                  color={amount > 1 ? MAIN_THEME_COLOR : "black"}
                />
              </TouchableOpacity>
              <Text
                style={{ fontSize: deviceWidth * 0.05, fontWeight: "bold" }}
              >
                {amount}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const newItem = context.cart[itemId];
                  ++newItem.amount;
                  context.setGlobalState({
                    ...context,
                    cart: {
                      ...context.cart,
                      [itemId]: newItem,
                    },
                  });
                  calculateSubTotal(context.cart);
                }}
              >
                <FontAwesomeIcon icon={faPlus} color={MAIN_THEME_COLOR} />
              </TouchableOpacity>
            </View>
            <Text>Size: {size}</Text>
            <Text>Color: {color}</Text>
            <TouchableOpacity
              style={localStyles.deleteBtn}
              onPress={() => {
                let newCart = _.cloneDeep(context.cart);
                delete newCart[itemId];
                context.setGlobalState({
                  ...context,
                  cart: newCart,
                });
                calculateSubTotal(context.cart);
              }}
            >
              <FontAwesome5
                icon={faTrash}
                size={deviceWidth * 0.05}
                color={MAIN_THEME_COLOR}
              />
            </TouchableOpacity>
          </View>
        );
      }}
    </GlobalContext.Consumer>
  );
}

export default function Cart() {
  const [subTotal, setSubtotal] = useState(0),
    [shipping, setShipping] = useState(0),
    [tax, setTax] = useState(0);

  const calculateSubTotal = (cart) => {
    let newSubTotal = 0;
    if (Object.keys(cart).length !== 0) {
      Object.keys(cart).map((itemId) => {
        const amount = cart[itemId].amount,
          price = cart[itemId].item.price;
        newSubTotal += amount * price;
      });
    }

    setSubtotal(newSubTotal);

    return newSubTotal;
  };

  const calculateTax = (cart) => {
    const newTax = subTotal * TAX_RATE;
    setTax(newTax);
    return newTax;
  };

  const calculateShipping = async () => {
    /*
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/javascript");

    var raw =
      '{\n     "pickup_address" : "202 Jeanette Lancaster Way, Charlottesville, VA, 22903",\n     "dropoff_address" : "600 McCormick Rd, Charlottesville, VA, 22904",\n    "sandbox": "true"\n}';

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    let shippingPrice= 0;
    await fetch(
      "https://spyd9htiua.execute-api.us-east-2.amazonaws.com/beta/checkprice",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {console.log(result); shippingPrice= result['fee']/100;})
      .catch((error) => console.log("error", error));

    setShipping(shippingPrice);
    */
  };

  return (
    <GlobalContext.Consumer>
      {(context) => (
        <View>
          <ScrollView>
            <View
              style={{
                ...styles.fullPageContainer,
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              {Object.keys(context.cart).length == 0 ? (
                <View
                  style={{
                    position: "absolute",
                    width: deviceWidth,
                    height: deviceHeight,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: -deviceHeight * 0.1,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: deviceWidth * 0.06,
                      alignItems: "center",
                    }}
                  >
                    Wow, such empty!
                  </Text>
                  <MaterialCommunityIcons
                    name="dog"
                    size={deviceWidth * 0.2}
                    color={MAIN_THEME_COLOR}
                  />
                </View>
              ) : (
                <View>
                  <View
                    style={{
                      ...styles.rowContainer,
                      justifyContent: "space-evenly",
                      marginBottom: deviceHeight * 0.04,
                    }}
                  >
                    <TextInput
                      style={{ ...localStyles.textInput }}
                      autoCorrect={false}
                    />
                    <TouchableOpacity style={{ ...localStyles.btn }}>
                      <Text>Add Promo Code</Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      ...styles.titletext,
                      fontSize: deviceWidth * 0.05,
                    }}
                  >
                    Items In Cart
                  </Text>
                  <View
                    style={{
                      height: deviceHeight * 0.5,
                      marginVertical: deviceHeight * 0.02,
                    }}
                  >
                    <ScrollView horizontal={true}>
                      {Object.keys(context.cart).map((key) => (
                        <Card
                          itemId={key}
                          key={key}
                          calculateSubTotal={calculateSubTotal}
                        />
                      ))}
                    </ScrollView>
                  </View>
                  <Text
                    style={{
                      ...styles.titletext,
                      fontSize: deviceWidth * 0.05,
                    }}
                  >
                    Order Summary
                  </Text>
                  <Text style={{ ...styles.gridtext }}>
                    Subtotal: $
                    {subTotal == 0 ? calculateSubTotal(context.cart) : subTotal}
                  </Text>
                  <Text style={{ ...styles.gridtext }}>
                    Tax: ${tax == 0 ? calculateTax(context.cart) : tax}
                  </Text>
                  <Text style={{ ...styles.gridtext, fontWeight: "bold" }}>
                    Total: ${tax + subTotal + shipping}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
          {Object.keys(context.cart).length === 0 ? null : (
            <View style={localStyles.checkoutContainer}>
              <TouchableOpacity style={localStyles.checkoutBtn}>
                <Text style={{ fontSize: deviceWidth * 0.05 }}>
                  Proceed to Checkout
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </GlobalContext.Consumer>
  );
}

const localStyles = StyleSheet.create({
  image: {
    height: 200,
    backgroundColor: "transparent",
  },
  card: {
    width: deviceWidth * 0.5,
    height: deviceHeight * 0.5,
    borderWidth: 2,
    borderColor: MAIN_THEME_COLOR,
    borderRadius: deviceWidth * 0.05,
    marginHorizontal: deviceWidth * 0.02,
    justifyContent: "center",
    alignContent: "space-around",
    position: "relative",
  },
  btn: {
    backgroundColor: MAIN_THEME_COLOR,
    padding: deviceWidth * 0.04,
    borderRadius: deviceWidth * 0.07,
  },
  textInput: {
    backgroundColor: "transparent",
    width: "60%",
    height: "100%",
    borderWidth: 1,
    borderRadius: deviceWidth * 0.1,
    marginRight: deviceWidth * 0.08,
    paddingHorizontal: deviceWidth * 0.04,
    fontSize: deviceHeight * 0.03,
  },
  deleteBtn: {
    width: "100%",
    position: "absolute",
    height: "10%",
    bottom: 0,
    right: 0,
    alignItems: "center",
    paddingTop: 5,
    marginTop: deviceHeight * 0.05,
    borderTopWidth: 2,
    borderTopColor: MAIN_THEME_COLOR,
  },
  checkoutContainer: {
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    left: 0,
    width: deviceWidth,
    height: deviceHeight * 0.1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
  },
  checkoutBtn: {
    height: "100%",
    width: "90%",
    backgroundColor: MAIN_THEME_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: deviceWidth * 0.05,
  },
});
