import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
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
// import Swiper from "react-native-swiper";

export function ViewItem({
  name,
  base_price,
  description,
  variants,
  add_ons,
  setIsVisible,
  images,
}) {
  const [requiredSelection, setRequired] = useState({});
  const [currentAmount, setCurrentAmount] = useState(1);
  const [addOn, setAddOn] = useState({});
  const [totalCost, setTotal] = useState(base_price ? base_price : 0);

  useEffect(
    function updatePrice() {
      let totalRequired = 0,
        totalAddOn = 0;

      console.log(`base_price = ${base_price}`);

      Object.values(requiredSelection).map(
        (item) => (totalRequired += item.price ? item.price : 0)
      );
      Object.values(addOn).map(
        (item) => (totalAddOn += item.price && item.isChecked ? item.price : 0)
      );

      console.log(`totalRequired = ${totalRequired}`);
      console.log(`totalAddOn = ${totalAddOn}`);

      const newTotalCost =
        currentAmount *
        (totalRequired + totalAddOn + (base_price ? base_price : 0));
      console.log(`newTotalCost = ${newTotalCost}`);
      setTotal(newTotalCost);
    },
    [requiredSelection, currentAmount, addOn]
  );

  const cleanUpDataWhenExit = () => {
    setRequired("");
    setCurrentAmount(1);
  };

  const isRequiredOptionFulfilled = () => {
    let isFullFilled = true;
    if (Array.isArray(variants) && variants.length != 0) {
      for (let index = 0; index < variants.length; ++index) {
        if (!(
          requiredSelection.hasOwnProperty(variants[index]["name"]) &&
          requiredSelection[variants[index]["name"]].value
        )) {
          isFullFilled= false;
          break;
        }
      }
    } else return false;

    return isFullFilled;
  };

  const parsePrice = (str) => {
    if (!str) return 0;
    let price = "",
      index = str.length - 1;

    while (index >= 0 && str[index] != " ") {
      price = str[index] + price;
      --index;
    }

    return price != "" ? parseFloat(price) : 0;
  };

  const getRequiredSelection = () => {
    return variants.map((variant) => {
      const items = variant["variants"].map((item) => ({
        label: item.name + " $ " + item.price,
        value: item.name + " $ " + item.price,
      }));

      return (
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            display: "flex",
            width: deviceWidth,
            paddingHorizontal: deviceWidth * 0.05,
            paddingVertical: 10,
          }}
        >
          <View style={{ flexDirection: "row", paddingBottom: 10 }}>
            <Text
              style={{
                ...styles.titletext,
                fontSize: deviceWidth * 0.05,
              }}
            >
              {variant.name}
            </Text>
            <Text
              style={{
                fontSize: deviceWidth * 0.05,
                marginTop: -4,
              }}
            >
              {" "}
              (required)
            </Text>
          </View>
          <RNPickerSelect
            style={{
              width: deviceWidth,
              height: 50,
              backgroundColor: "red",
            }}
            onValueChange={(value) => {
              setRequired({
                ...requiredSelection,
                [variant.name]: {
                  value: value,
                  price: parsePrice(value),
                },
              });
              console.log(`value = [${value}]`);
            }}
            items={items}
          >
            <View style={localStyles.picker}>
              <Text style={{ fontSize: deviceWidth * 0.05 }}>
                {requiredSelection[variant.name]
                  ? requiredSelection[variant.name].value
                  : "Select an option"}
              </Text>
              <Entypo
                name="chevron-down"
                size={deviceWidth * 0.05}
                color="black"
              />
            </View>
          </RNPickerSelect>
        </View>
      );
    });
  };

  const getAddOns = () => {
    return add_ons.map((add_on) => (
      <View
        style={{
          ...styles.rowContainer,
          width: deviceWidth * 0.9,
          backgroundColor: "transparent",
        }}
      >
        <View style={{ borderWidth: 2 }}>
          <Checkbox
            status={
              addOn && addOn[add_on["name"]]
                ? addOn[add_on["name"]].isChecked
                  ? "checked"
                  : "unchecked"
                : "unchecked"
            }
            onPress={() => {
              addOn && addOn[add_on["name"]]
                ? setAddOn({
                    ...addOn,
                    [add_on["name"]]: {
                      ...addOn[add_on["name"]],
                      isChecked: !addOn[add_on["name"]].isChecked,
                    },
                  })
                : setAddOn({
                    ...addOn,
                    [add_on["name"]]: { isChecked: true, price: add_on.price },
                  });
            }}
          />
        </View>
        <View
          style={{
            ...styles.rowContainer,
            flex: 1,
            height: 40,
            paddingHorizontal: 10,
            justifyItems: "center",
            borderBottomWidth: 1,
          }}
        >
          <Text style={{ fontSize: 16 }}>{add_on["name"]}</Text>
          <Text style={{ fontSize: 16 }}>$ {add_on["price"]}</Text>
        </View>
      </View>
    ));
  };

  const addToCart = (context) => {
    const newItem = {
        item: context.viewedItem,
        amount: currentAmount,
        requiredSelection: requiredSelection,
        addOn: addOn,
        total: totalCost,
      },
      itemId = context.viewedItem.objectID;
    let newCart = context.cart;
    console.log(`itemId= ${itemId}`);
    newCart.hasOwnProperty(itemId)
      ? (newCart[itemId].amount += currentAmount)
      : (newCart[itemId] = newItem);
    context.setGlobalState({ ...context, cart: newCart });
    createAlert("Item added", `${name} is added to your cart!`);
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
        <Modal animationType={"slide"} visible={true}>
          {Array.isArray(variants) && Array.isArray(add_ons) ? (
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
                  cleanUpDataWhenExit();
                  setIsVisible(false);
                }}
                style={localStyles.modalExitBtn}
              >
                <Text style={{ fontSize: deviceWidth * 0.1 }}>X</Text>
              </TouchableOpacity>
              <View>
                <Image
                  source={{uri: images}}
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
                    paddingBottom: 120,
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
                        paddingTop: 20,
                      }}
                    >
                      {name}
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
                  {getRequiredSelection()}
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
                    {getAddOns()}
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
                        width: deviceWidth * 0.5,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          currentAmount > 1
                            ? setCurrentAmount(currentAmount - 1)
                            : null;
                        }}
                        disabled={currentAmount <= 1}
                      >
                        <AntDesign
                          name="minuscircle"
                          size={deviceWidth * 0.08}
                          color={currentAmount > 1 ? MAIN_THEME_COLOR : "gray"}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: deviceWidth * 0.07,
                          fontWeight: "bold",
                        }}
                      >
                        {currentAmount}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setCurrentAmount(currentAmount + 1)}
                      >
                        <AntDesign
                          name="pluscircle"
                          size={deviceWidth * 0.08}
                          color={MAIN_THEME_COLOR}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
                <TouchableOpacity
                  style={{
                    ...localStyles.addToCartBtn,
                    backgroundColor: !isRequiredOptionFulfilled()
                      ? "#a6a6a6"
                      : MAIN_THEME_COLOR,
                  }}
                  onPress={() => addToCart(context)}
                  disabled={!isRequiredOptionFulfilled()}
                >
                  <Text
                    style={{
                      color: requiredSelection === "" ? "white" : "black",
                      fontSize: deviceWidth * 0.05,
                    }}
                  >
                    Add To Cart
                  </Text>
                  <View style={{ position: "absolute", right: 20, top: 30 }}>
                    <Text style={{ fontSize: deviceWidth * 0.05 }}>
                      $ {totalCost}
                    </Text>
                  </View>
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
    top: 50,
    left: 20,
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
    width: deviceWidth,
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 200,
    padding: deviceWidth * 0.02,
    alignItems: "center",
    justifyContent: "center",
  },
});
