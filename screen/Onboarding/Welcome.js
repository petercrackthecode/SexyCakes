import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import {
  mobileStyles as styles,
  deviceHeight,
  deviceWidth,
} from "../../styles/mobile";
import Swiper from "react-native-swiper";

const BRANDs_YOU_LOVE_IMAGE = require("../../assets/images/BrandsYouLoveImage.png"),
  FAST_DELIVERY_IMAGE = require("../../assets/images/FastDeliveryImage.png"),
  BEST_PRICES_IMAGE = require("../../assets/images/BestPricesImage.png");

const CARD_DATA = [
  {
    title: "Brands You Love",
    description:
      "Looks like you haven't entered a location shop stores near you",
    imageURI: "../../assets/images/BrandsYouLoveImage.png",
    key: "1",
  },
  {
    title: "Fast Delivery",
    description:
      "Looks like you haven't entered a location shop stores near you",
    imageURI: "../../assets/images/FastDeliveryImage.png",
    key: "2",
  },
  {
    title: "Best Prices",
    description:
      "Looks like you haven't entered a location shop stores near you",
    imageURI: "../../assets/images/BestPricesImage.png",
    key: "3",
  },
];

function Card(
  title = "Title Error",
  description = "Description Error",
  imageURI,
  key
) {
  const image =
    title === "Brands You Love"
      ? BRANDs_YOU_LOVE_IMAGE
      : title === "Fast Delivery"
      ? FAST_DELIVERY_IMAGE
      : BEST_PRICES_IMAGE;
  return (
    <View
      key={key}
      style={{ justifyContent: 'center', alignItems: 'center',}}
    >
      <Image
        source={image}
        style={{ width: deviceWidth, height: '80%', }}
        resizeMode="contain"
      />
      <Text style={styles.titletext}>{title}</Text>
      <Text style={{...styles.gridtext, paddingHorizontal: deviceWidth * 0.05}}>{description}</Text>
    </View>
  );
}

export default Welcome = ({ navigation }) => {
  return (
    <View
      style={{
        ...styles.fullPageContainer,
        paddingTop: 0,
        height: deviceHeight * 0.9,
        justifyContent: 'space-evenly',
      }}
    >
      <View style={{width: deviceWidth, height: '90%'}}>
        <Swiper showsButtons={false} loop={false} style={{}}>
          {CARD_DATA.map((card) =>
            Card(card.title, card.description, card.imageURI, card.key)
          )}
        </Swiper>
      </View>
      <TouchableOpacity
        style={{ ...styles.button, ...localStyles.getStartedButton }}
        onPress={() => navigation.navigate("Location")}
      >
        <Text>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  getStartedButton: {
    width: 222,
    backgroundColor: "#64BACB",
    borderRadius: 24,
    minHeight: 53,
    marginBottom: 40,
  },
});
