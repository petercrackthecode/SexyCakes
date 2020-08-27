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
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  GlobalContext,
} from "../components/Context/globalContext";

const TAX_RATE = 0.09;

const _ = require("lodash");

const roundToTwoDecimal = (num) => {
  return Math.ceil(num * 100)/100;
}

function Card({ itemId }) {
  return (
    <GlobalContext.Consumer>
      {(context) => {
        const { item, amount } = context.cart[itemId],
          { name } = item;
        return (
          <View style={{ ...localStyles.card }}>
            <View
              style={{
                flex: 0.8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/images/sexy_cakes_logo.jpg")}
                resizeMode="stretch"
                style={localStyles.image}
              />
              <View
                style={{
                  marginTop: -50,
                }}
              >
                <Text style={{ fontSize: deviceWidth * 0.05 }}>{name}</Text>
              </View>
            </View>
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <View
              style={{
                ...styles.rowContainer,
                width: "100%",
                justifyContent: "space-around",
                marginTop: 30,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (amount > 1) {
                    let newItem = context.cart[itemId];
                    --newItem.amount;
                    newItem.total *= newItem.amount / (newItem.amount + 1);
                    newItem.total= roundToTwoDecimal(newItem.total);
                    context.setGlobalState({
                      ...context,
                      cart: {
                        ...context.cart,
                        [itemId]: newItem,
                      },
                    });
                    console.log(`new amount = ${context.cart[itemId].amount}`);
                  }
                }}
              >
                <Entypo
                  name="minus"
                  color={amount > 1 ? MAIN_THEME_COLOR : "black"}
                  size={deviceWidth * 0.06}
                />
              </TouchableOpacity>
              <Text
                style={{ fontSize: deviceWidth * 0.06, fontWeight: "bold" }}
              >
                {amount}
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  let newItem = context.cart[itemId];
                  ++newItem.amount;
                  newItem.total *= newItem.amount / (newItem.amount - 1);
                  newItem.total= roundToTwoDecimal(newItem.total);
                  context.setGlobalState({
                    ...context,
                    cart: {
                      ...context.cart,
                      [itemId]: newItem,
                    },
                  });
                  console.log(`new amount = ${context.cart[itemId].amount}`);
                }}
              >
                <AntDesign
                  name="plus"
                  color={MAIN_THEME_COLOR}
                  size={deviceWidth * 0.06}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 5,
              }}
            >
              <Text style={{ fontSize: deviceWidth * 0.06 }}>
                $ {context.cart[itemId].total}
              </Text>
            </View>
            <TouchableOpacity
              style={localStyles.deleteBtn}
              onPress={() => {
                let newCart = _.cloneDeep(context.cart);
                delete newCart[itemId];
                context.setGlobalState({
                  ...context,
                  cart: newCart,
                });
              }}
            >
              <Entypo
                name="trash"
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

function OrderSum({ subTotal, cart, calculateSubTotal, calculateTax, tax }) {
  useEffect(() => {
    (async () => {await calculateTax(cart);})();
  }, [cart]);

  return (
    <View>
      <Text
        style={{
          ...styles.titletext,
          fontSize: deviceWidth * 0.05,
        }}
      >
        Order Summary
      </Text>
      <Text style={{ ...styles.gridtext }}>
        Subtotal: ${subTotal ? subTotal : calculateSubTotal(cart)}
      </Text>
      <Text style={{ ...styles.gridtext }}>
        Tax: ${tax == 0 ? calculateTax() : tax}
      </Text>
      <Text style={{ ...styles.gridtext, fontWeight: "bold" }}>
        Total: ${tax + subTotal}
      </Text>
    </View>
  );
}

export default function Cart({context}) {
  const [subTotal, setSubtotal] = useState(0),
    [tax, setTax] = useState(0);

  const calculateSubTotal = (cart) => {
    let newSubTotal = 0;
    console.log(`Object.keys(cart).length = ${Object.keys(cart).length}`);
    Object.keys(cart).map(key => console.log(`key = ${key}`));
    if (cart && Object.keys(cart).length !== 0) {
      Object.keys(cart).map((itemId) => {
        const price = cart[itemId].total;
        newSubTotal += price;
      });
    }

    newSubTotal= roundToTwoDecimal(newSubTotal);

    console.log(`Hi I'm Subtotal = ${newSubTotal}`);

    setSubtotal(newSubTotal);
    return newSubTotal;
  };

  useEffect(() => {
    console.log(`context changes`);
    console.log(`context.cart = `); 
    // console.log(context.cart);
    console.log(`new subTotal = ${calculateSubTotal(context.cart)}`);
  }, [context.cart]);

  useEffect(() => {
    calculateTax();
  }, [subTotal]);

  const calculateTax = () => {
    const newTax = roundToTwoDecimal(subTotal * TAX_RATE);
    setTax(newTax);
    return newTax;
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
                        />
                      ))}
                    </ScrollView>
                  </View>
                  <OrderSum
                    subTotal={subTotal}
                    cart={context.cart}
                    calculateSubTotal={calculateSubTotal}
                    calculateTax={calculateTax}
                    tax={tax}
                  />
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
    flex: 1,
    width: "100%",
    borderRadius: deviceWidth * 0.05,
  },
  card: {
    width: deviceWidth * 0.5,
    height: deviceHeight * 0.4,
    borderWidth: 2,
    borderColor: MAIN_THEME_COLOR,
    borderRadius: deviceWidth * 0.05,
    marginHorizontal: deviceWidth * 0.02,
    justifyContent: "flex-start",
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
