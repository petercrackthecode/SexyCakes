import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  Button,
  Modal,
  Alert,
} from "react-native";
import {
  mobileStyles as styles,
  deviceHeight,
  deviceWidth,
  MAIN_THEME_COLOR,
} from "../../styles/mobile";

import { AntDesign } from "@expo/vector-icons";
import KeyboardSpacer from "react-native-keyboard-spacer";
import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-input-credit-card";
import { withAuth } from "../Context/AuthContext";

const _ = require("lodash");

export default function AddPayment({ setVisible, setLoginVisible }) {
  const [cardInfo, setCardInfo] = useState({});
  const [isCardValid, setIsCardValid] = useState(true);

  const changeUserStatus = (context, ccnumber, exp_month, exp_year, cvc, type) => {
    context.setUser({
      ...context,
      isLoggedIn: true,
      ccnumber: ccnumber,
      exp_month: exp_month,
      exp_year: exp_year,
      cvc: cvc,
      type: type
    });
  };

  const handleChange = (form) => {
    setCardInfo(form);
  };

  const handleClick = (context) => {
    if (cardInfo.valid) {
      setIsCardValid(true);
      let { number, expiry, cvc, type } = _.cloneDeep(cardInfo.values);
      const trimmedNumber = number
        .split("")
        .filter((character) => "0" <= character && character <= "9")
        .join("");
      const exp_month = expiry.split("/")[0],
        exp_year = expiry.split("/")[1];

      changeUserStatus(context, trimmedNumber, exp_month, exp_year, cvc, type);
    } else {
      setIsCardValid(false);
    }
  };

  return (
    <withAuth.Consumer>
      {(context) => (
        <Modal visible={true} animationType="slide">
          <View
            style={{
              ...styles.fullPageContainer,
              paddingTop: -deviceHeight * 0.1,
            }}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setVisible(false)}
            >
              <AntDesign
                name="arrowleft"
                size={deviceWidth * 0.07}
                color="black"
              />
            </TouchableOpacity>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: deviceHeight * 0.2,
              }}
            >
              <CreditCardInput
                invalidColor="red"
                validColor="green"
                style={{ width: deviceWidth }}
                cardScale={1.4}
                onChange={handleChange}
              />
              <Text
                style={{
                  ...styles.warningText,
                  position: "absolute",
                  bottom: "30%",
                  display: isCardValid ? "none" : "flex",
                }}
              >
                Invalid card information
              </Text>
              <TouchableOpacity
                style={localStyles.button}
                onPress={() => handleClick(context)}
              >
                <Text style={{ fontSize: deviceWidth * 0.05 }}>Finish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </withAuth.Consumer>
  );
}

const localStyles = StyleSheet.create({
  button: {
    backgroundColor: MAIN_THEME_COLOR,
    borderRadius: deviceWidth * 0.05,
    padding: 10,
    paddingHorizontal: 20,
    marginTop: deviceHeight * 0.02,
    position: "absolute",
    zIndex: 100,
    bottom: "10%",
  },
});
