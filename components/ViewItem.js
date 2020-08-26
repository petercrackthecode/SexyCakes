import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { GlobalContext } from "../components/Context/globalContext";
import {
  deviceWidth,
  deviceHeight,
  mobileStyles as styles,
  MAIN_THEME_COLOR,
} from "../styles/mobile";

import RNPickerSelect from "react-native-picker-select";
import { LinearGradient } from "expo-linear-gradient";
import { Checkbox } from "react-native-paper";
import Swiper from "react-native-swiper";

function DropDowns() {
  return (
    <View
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
        display: "flex",
        width: deviceWidth,
        paddingHorizontal: deviceWidth * 0.05,
      }}
    >
      <View style={{ flexDirection: "row", paddingBottom: 10 }}>
        <Text
          style={{
            ...styles.titletext,
            fontSize: deviceWidth * 0.05,
          }}
        >
          Topping
        </Text>
        <Text style={{ fontSize: deviceWidth * 0.05, marginTop: -4 }}>
          {" "}
          (dropDowns)
        </Text>
      </View>
      <RNPickerSelect
        style={{
          width: deviceWidth,
          height: 50,
          backgroundColor: "red",
        }}
        onValueChange={(value) => setDropDown(value)}
        items={topping}
      >
        <View style={localStyles.picker}>
          <Text style={{ fontSize: deviceWidth * 0.05 }}>
            {/*dropDowns !== "" ? dropDowns : "Select a size"*/}
          </Text>
          <Entypo name="chevron-down" size={deviceWidth * 0.05} color="black" />
        </View>
      </RNPickerSelect>
    </View>
  );
}

export function ViewItem({
  images,
  name,
  base_price,
  description,
  variants,
  isVisible,
  setIsVisible,
}) {
  const topping = variants
    ? variants[0]["variants"].map((variant) => ({
        label: `${variant.name} ${
          variant.price ? "+ $" + variant.price : "(Free)"
        }`,
        value: `${variant.name} ${
          variant.price ? "+ $" + variant.price : "(Free)"
        }`,
      }))
    : [{ label: "loading", value: "loading", key: "loading" }];
  const [dropDowns, setDropDown] = useState({});
  const [currentAmount, setCurrentAmount] = useState(1);
  const [addOn, setAddOn] = useState();

  const cleanUpDataWhenExit = () => {
    setDropDown("");
    setCurrentAmount(1);
    console.log(typeof variants);
  };

  const addToCart = (context) => {
    const newItem = {
        item: context.viewedItem,
        amount: currentAmount,
        size: dropDowns,
      },
      itemId = context.viewedItem.product_id;
    let newCart = context.cart;
    newCart.hasOwnProperty(itemId)
      ? (newCart[itemId].amount += currentAmount)
      : (newCart[itemId] = newItem);
    context.setGlobalState({ ...context, cart: newCart });
    createAlert("Item added", `${title} is added to your cart!`);
  };

  const createAlert = (title, message) =>
    Alert.alert(
      title,
      message,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
        },
      ],
      { cancelale: false }
    );

  return (
    <GlobalContext.Consumer>
      {(context) => (
        <Modal animationType={"slide"} visible={isVisible}>
          {variants ? (
            <View
              style={{
                ...styles.fullPageContainer,
                paddingHorizontal: 0,
                backgroundColor: "transparent",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setIsVisible(false);
                  cleanUpDataWhenExit();
                }}
                style={localStyles.modalExitBtn}
              >
                <Text style={{ fontSize: deviceWidth * 0.1 }}>X</Text>
              </TouchableOpacity>
              <View>
                <Image
                  source={require("../assets/images/sexy_cakes_logo.jpg")}
                  resizeMode="cover"
                  style={localStyles.image}
                />
              </View>
              <LinearGradient
                colors={["#4BC0C8", "#C779D0", "#FEAC5E"]}
                style={{
                  position: "absolute",
                  zIndex: 100,
                  bottom: 0,
                  left: 0,
                  height: deviceHeight * 0.6,
                  borderRadius: deviceWidth * 0.1,
                }}
              >
                <ScrollView
                  contentContainerStyle={{
                    ...styles.columnContainer,
                    justifyContent: "space-evenly",
                    height: "100%",
                  }}
                >
                  <View
                    style={{
                      ...styles.rowContainer,
                      paddingHorizontal: deviceHeight * 0.03,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.titletext,
                        fontSize: deviceWidth * 0.06,
                        marginRight: deviceWidth * 0.1,
                        paddingTop: 7,
                      }}
                    >
                      {name}
                    </Text>
                    <Text style={{ fontSize: deviceWidth * 0.06 }}>
                      $ {base_price}
                    </Text>
                  </View>
                  <Text
                    style={{
                      paddingHorizontal: deviceWidth * 0.05,
                      ...styles.gridtext,
                    }}
                  >
                    {description}
                  </Text>
                  <View
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      display: "flex",
                      width: deviceWidth,
                      paddingHorizontal: deviceWidth * 0.05,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.titletext,
                        fontSize: deviceWidth * 0.05,
                        marginRight: deviceWidth * 0.1,
                        paddingTop: 7,
                      }}
                    >
                      Add-on
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.rowContainer,
                      marginVertical: deviceHeight * 0.03,
                    }}
                  >
                    <View
                      style={{
                        ...styles.rowContainer,
                        justifyContent: "space-around",
                        width: "50%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          currentAmount > 1
                            ? setCurrentAmount(currentAmount - 1)
                            : null;
                        }}
                      >
                        <Entypo
                          name="minus"
                          size={24}
                          color={currentAmount > 1 ? MAIN_THEME_COLOR : "black"}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: deviceWidth * 0.05,
                          fontWeight: "bold",
                        }}
                      >
                        {currentAmount}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setCurrentAmount(currentAmount + 1)}
                      >
                        <Entypo name="plus" color={MAIN_THEME_COLOR} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
                <TouchableOpacity
                  style={{
                    ...localStyles.addToCartBtn,
                    backgroundColor:
                      dropDowns === "" ? "#a6a6a6" : MAIN_THEME_COLOR,
                  }}
                  onPress={() => addToCart(context)}
                  disabled={dropDowns === ""}
                >
                  <Text
                    style={{
                      color: dropDowns === "" ? "white" : "black",
                    }}
                  >
                    Add To Cart
                  </Text>
                  <Text>{variants.toString()}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          ) : (
            <ActivityIndicator size="large" color={MAIN_THEME_COLOR} />
          )}
        </Modal>
      )}
    </GlobalContext.Consumer>
  );
}

const localStyles = StyleSheet.create({
  modalExitBtn: {
    position: "absolute",
    zIndex: 2,
    top: "7%",
    left: "7%",
  },
  image: {
    width: deviceWidth,
    height: deviceHeight * 0.4,
    backgroundColor: "transparent",
  },
  picker: {
    borderWidth: 1.5,
    borderColor: MAIN_THEME_COLOR,
    borderRadius: deviceWidth * 0.05,
    paddingHorizontal: deviceWidth * 0.02,
    paddingVertical: deviceHeight * 0.01,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addToCartBtn: {
    height: 80,
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 200,
    borderRadius: deviceWidth * 0.07,
    padding: deviceWidth * 0.02,
    alignItems: "center",
    justifyContent: "center",
  },
});
