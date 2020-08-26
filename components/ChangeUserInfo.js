import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  Modal,
  Alert,
} from "react-native";
import {
  mobileStyles as styles,
  deviceHeight,
  deviceWidth,
  MAIN_THEME_COLOR,
} from "../styles/mobile";
import { AntDesign } from '@expo/vector-icons';
import { withAuth } from "./Context/AuthContext";
import AddPayment from "./Billing/AddPayment";

const SATISFIED_GREEN = "#00FA9A",
  SATISFIED_GREEN_WITH_OPACITY = "rgba(0, 250, 154, 0.15)",
  API_KEY = `AIzaSyCMhVeYtBerhX7ViYqNviZapS67l1Mz4U0`;

export function ChangeUserInfo({ isVisible, setVisible }) {
  const [firstName, setFirstName] = useState({
      value: "",
      isValid: true,
    }),
    [lastName, setLastName] = useState({
      value: "",
      isValid: true,
    }),
    [address, setAddress] = useState({
      zipCode: "",
      street: "",
      // some cities can share a zip code, so we have to point out the exact city
      city: "",
    });

  const [isPaymentVisible, setIsPaymentVisible] = useState(false);

  return (
    <withAuth.Consumer>
      {(context) => (
        <Modal visible={isVisible} animationType="slide">
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
              <AntDesign name="arrowleft" size={deviceWidth * 0.07} color="black" />
            </TouchableOpacity>
            <View style={{ ...styles.rowContainer, width: "100%" }}>
              <TextInput
                style={localStyles.inputField}
                placeholder="First Name"
                autoFocus={true}
                autoCorrect={false}
                value={firstName.value}
                onChangeText={(value) =>
                  setFirstName({ ...firstName, value: value })
                }
              />
              <TextInput
                style={localStyles.inputField}
                placeholder="Last Name"
                autoCorrect={false}
                value={lastName.value}
                onChangeText={(value) =>
                  setLastName({ ...lastName, value: value })
                }
              />
            </View>
            <TextInput
              style={{
                ...localStyles.inputField,
                width: "100%",
                marginVertical: deviceHeight * 0.03,
              }}
              placeholder="Street"
              value={address.street}
              onChangeText={(value) => setAddress({...address, street: value})}
            />
            <View style={{ ...styles.rowContainer, width: "100%" }}>
              <TextInput
                style={{ ...localStyles.inputField, width: "35%" }}
                placeholder="Zipcode"
                autoCorrect={false}
                value={address.zipCode}
                onChangeText={(value) => setAddress({...address, zipCode: value})}
              />
              <TextInput
                style={{ ...localStyles.inputField, width: "55%" }}
                placeholder="City"
                autoCorrect={false}
                value={address.city}
                onChangeText={(value) => setAddress({...address, city: value})}
              />
            </View>
            <TouchableOpacity style={localStyles.button} onPress={() => setIsPaymentVisible(true)}>
              <Text style={{ fontSize: deviceWidth * 0.05 }}>Add Payment</Text>
            </TouchableOpacity>
            <AddPayment
              isVisible={isPaymentVisible}
              setVisible={setIsPaymentVisible}
            />
          </View>
        </Modal>
      )}
    </withAuth.Consumer>
  );
}

const localStyles = StyleSheet.create({
  sendAgainButton: {
    position: "absolute",
    bottom: 2,
    right: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 2,
  },
  inputBox: {
    width: "95%",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    padding: 0,
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 20,
  },
  inputField: {
    paddingVertical: 0,
    fontSize: 20,
    width: "45%",
    height: 40,
    padding: 5,
    backgroundColor: "rgba(220,220,220, 0.5)",
    borderRadius: 10,
  },
  verifyCodeButton: {
    backgroundColor: SATISFIED_GREEN,
    borderRadius: 7,
    justifyContent: "center",
    paddingHorizontal: deviceWidth * 0.05,
    position: "absolute",
    right: -5,
    bottom: -2,
    height: "100%",
    width: "35%",
  },
  button: {
    backgroundColor: SATISFIED_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: deviceHeight * 0.03,
    padding: 10,
    borderRadius: 20,
  },
});
