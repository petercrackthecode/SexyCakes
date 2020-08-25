import React, { useState } from "react";
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
  Alert
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronDown,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { GlobalContext } from "../components/Context/globalContext";
import {
  deviceWidth,
  deviceHeight,
  mobileStyles as styles,
  MAIN_THEME_COLOR,
} from "../styles/mobile";

import RNPickerSelect from "react-native-picker-select";
import { LinearGradient } from "expo-linear-gradient";
import Swiper from "react-native-swiper";

export function ViewItem({
  images,
  title,
  price,
  description,
  sizes,
  colors,
  isVisible,
  setIsVisible,
}) {
  const mySizes = Array.isArray(sizes)
    ? sizes.map((size) => ({
        label: size.size,
        value: size.size,
        key: size.size,
        displayValue: true,
      }))
    : [{ label: "loading", value: "loading", key: "loading" }];

  const myColors = Array.isArray(colors)
    ? colors.map((color) => ({
        label: color,
        value: color,
        key: color,
        displayValue: true,
      }))
    : [{ label: "loading", value: "loading", key: "loading" }];

  const [currentSize, setCurrentSize] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [currentAmount, setCurrentAmount] = useState(1);

  const cleanUpDataWhenExit = () => {
    setCurrentSize("");
    setCurrentColor("");
    setCurrentAmount(1);
  };

  const addToCart = (context) => {
    const newItem = {
        item: context.viewedItem,
        amount: currentAmount,
        size: currentSize,
        color: currentColor,
      },
      itemId = context.viewedItem.product_id;
    let newCart = context.cart;
    newCart.hasOwnProperty(itemId)
      ? (newCart[itemId].amount += currentAmount)
      : (newCart[itemId] = newItem);
    context.setGlobalState({ ...context, cart: newCart });
    createAlert("Item added", `${title} is added to your cart!`);
  };

  const createAlert= (title, message) => (
    Alert.alert(title, message, [
      {
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'OK'
      }
    ], 
    {cancelale: false})
  );

  return (
    <GlobalContext.Consumer>
      {(context) => (
        <Modal animationType={"slide"} visible={isVisible}>
          <ScrollView>
            <View
              style={{
                ...styles.fullPageContainer,
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
                {typeof images === "string" || Array.isArray(images) ? (
                  typeof images === "string" ? (
                    <Image
                      source={{ uri: images }}
                      resizeMode="contain"
                      style={localStyles.image}
                    />
                  ) : (
                    <Swiper showsButtons={true} loop={false}>
                      {images.map((imageUri) => (
                        <Image
                          source={{ uri: imageUri }}
                          resizeMode="contain"
                          style={localStyles.image}
                          key={imageUri}
                        />
                      ))}
                    </Swiper>
                  )
                ) : (
                  <Text>Error loading images</Text>
                )}
              </View>
              <LinearGradient
                colors={["#4BC0C8", "#C779D0", "#FEAC5E"]}
                style={{
                  ...styles.columnContainer,
                  height: deviceHeight * 0.6,
                  borderRadius: deviceWidth * 0.1,
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
                      fontSize: deviceWidth * 0.05,
                      marginRight: deviceWidth * 0.1,
                      paddingTop: 7,
                    }}
                  >
                    {title}
                  </Text>
                  <Text style={{ fontSize: deviceWidth * 0.05 }}>${price}</Text>
                </View>
                <Text style={{ paddingHorizontal: deviceWidth * 0.05 }}>
                  Lorem itspum dolor lorem ispus Lorem itspum dolor lorem ispus
                  Lorem itspum dolor lorem. Lorem itspum dolor lorem ispus
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
                    Size
                  </Text>
                  <RNPickerSelect
                    style={{
                      width: deviceWidth,
                      height: 50,
                      backgroundColor: "red",
                    }}
                    onValueChange={(value) => setCurrentSize(value)}
                    items={mySizes}
                  >
                    <View style={localStyles.picker}>
                      <Text style={{ fontSize: deviceWidth * 0.05 }}>
                        {currentSize !== "" ? currentSize : "Select a size"}
                      </Text>
                      <FontAwesomeIcon icon={faChevronDown} />
                    </View>
                  </RNPickerSelect>
                </View>
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
                    Color
                  </Text>
                  <RNPickerSelect
                    style={{
                      width: deviceWidth,
                      height: 50,
                      backgroundColor: "red",
                    }}
                    onValueChange={(value) => setCurrentColor(value)}
                    items={myColors}
                  >
                    <View style={localStyles.picker}>
                      <Text style={{ fontSize: deviceWidth * 0.05 }}>
                        {currentColor !== "" ? currentColor : "Choose a color"}
                      </Text>
                      <FontAwesomeIcon icon={faChevronDown} />
                    </View>
                  </RNPickerSelect>
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
                      <FontAwesomeIcon
                        icon={faMinus}
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
                      <FontAwesomeIcon icon={faPlus} color={MAIN_THEME_COLOR} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={{
                      ...localStyles.addToCartBtn,
                      backgroundColor:
                        currentSize === "" || currentColor === ""
                          ? "#a6a6a6"
                          : MAIN_THEME_COLOR,
                    }}
                    onPress={() => addToCart(context)}
                    disabled={currentSize === "" || currentColor === ""}
                  >
                    <Text
                      style={{
                        color:
                          currentSize === "" || currentColor === ""
                            ? "white"
                            : "black",
                      }}
                    >
                      Add To Cart
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </ScrollView>
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
    width: 150,
    height: deviceHeight * 0.07,
    borderRadius: deviceWidth * 0.07,
    padding: deviceWidth * 0.02,
    alignItems: "center",
    justifyContent: "center",
  },
});
