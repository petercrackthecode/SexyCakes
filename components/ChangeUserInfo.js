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
import { AntDesign } from "@expo/vector-icons";
import { withAuth } from "./Context/AuthContext";
import AddPayment from "./Billing/AddPayment";

const SATISFIED_GREEN = "#00FA9A",
  SATISFIED_GREEN_WITH_OPACITY = "rgba(0, 250, 154, 0.15)";
const API_KEY = `AIzaSyCMhVeYtBerhX7ViYqNviZapS67l1Mz4U0`;

export function ChangeUserInfo({ setVisible, setLoginVisible }) {
  const [firstName, setFirstName] = useState({
      value: "",
      isValid: true,
    }),
    [lastName, setLastName] = useState({
      value: "",
      isValid: true,
    }),
    [address, setAddress] = useState({
      zipCode: {
        value: "",
        isValid: true,
      },
      street: {
        value: "",
        isValid: true,
      },
      // some cities can share a zip code, so we have to point out the exact city
      city: {
        value: "",
        isValid: true,
      },
    });

  const zipcodeValidator = (zipcode) => {
    const zipcodeRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    return zipcodeRegex.test(zipcode.toString());
  };

  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [isInfoValid, setInfoValid] = useState(true);

  const checkInfoValid = () => {
    const isFirstNameValid = firstName.value !== "",
      isLastNameValid = lastName.value !== "",
      isZipCodeValid = zipcodeValidator(address.zipCode.value),
      isStreetValid = address.street.value !== "",
      isCityValid = address.city.value !== "";

    setFirstName({ ...firstName, isValid: isFirstNameValid });
    setLastName({ ...lastName, isValid: isLastNameValid });
    setAddress({
      ...address,
      zipCode: {
        ...address.zipCode,
        isValid: isZipCodeValid,
      },
      street: {
        ...address.street,
        isValid: isStreetValid,
      },
      city: {
        ...address.city,
        isValid: isCityValid,
      },
    });

    const InfoValid =
      isFirstNameValid &&
      isLastNameValid &&
      isStreetValid &&
      isCityValid &&
      isZipCodeValid;

    setInfoValid(InfoValid);

    return InfoValid;
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
            <View style={{ ...styles.rowContainer, width: "100%" }}>
              <View
                style={{
                  width: "45%",
                  borderWidth: firstName.isValid ? 0 : 1,
                  borderColor: firstName.isValid
                    ? "rgba(220,220,220, 0.5)"
                    : "red",
                  borderRadius: 10,
                }}
              >
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
              </View>
              <View
                style={{
                  width: "45%",
                  borderWidth: lastName.isValid ? 0 : 1,
                  borderColor: lastName.isValid
                    ? "rgba(220,220,220, 0.5)"
                    : "red",
                  borderRadius: 10,
                }}
              >
                <TextInput
                  style={{ ...localStyles.inputField }}
                  placeholder="Last Name"
                  autoCorrect={false}
                  value={lastName.value}
                  onChangeText={(value) =>
                    setLastName({ ...lastName, value: value })
                  }
                />
              </View>
            </View>
            <View
              style={{
                width: "100%",
                borderWidth: address.street.isValid ? 0 : 1,
                borderColor: address.street.isValid
                  ? "rgba(220,220,220, 0.5)"
                  : "red",
                borderRadius: 10,
                marginVertical: deviceHeight * 0.03,
              }}
            >
              <TextInput
                style={{
                  ...localStyles.inputField,
                }}
                placeholder="Street"
                value={address.street.value}
                onChangeText={(value) =>
                  setAddress({
                    ...address,
                    street: {
                      ...address.street,
                      value: value,
                    },
                  })
                }
              />
            </View>
            <View
              style={{
                ...styles.rowContainer,
                width: "100%",
                marginBottom: 30,
              }}
            >
              <View
                style={{
                  width: "35%",
                  borderWidth: address.zipCode.isValid ? 0 : 1,
                  borderColor: address.zipCode.isValid
                    ? "rgba(220,220,220, 0.5)"
                    : "red",
                  borderRadius: 10,
                }}
              >
                <TextInput
                  style={{ ...localStyles.inputField }}
                  placeholder="Zipcode"
                  autoCorrect={false}
                  value={address.zipCode}
                  onChangeText={(value) =>
                    setAddress({
                      ...address,
                      zipCode: {
                        ...address.zipCode,
                        value: value,
                      },
                    })
                  }
                />
              </View>
              <View
                style={{
                  width: "55%",
                  borderWidth: address.city.isValid ? 0 : 1,
                  borderColor: address.city.isValid
                    ? "rgba(220,220,220, 0.5)"
                    : "red",
                  borderRadius: 10,
                }}
              >
                <TextInput
                  style={{ ...localStyles.inputField }}
                  placeholder="City"
                  autoCorrect={false}
                  value={address.city}
                  onChangeText={(value) =>
                    setAddress({
                      ...address,
                      city: {
                        ...address.city,
                        value: value,
                      },
                    })
                  }
                />
              </View>
            </View>
            <Text
              style={{
                ...styles.warningText,
                display: isInfoValid ? "none" : "flex",
              }}
            >
              Please fill in your information
            </Text>
            <TouchableOpacity
              style={localStyles.button}
              onPress={() => {
                if (checkInfoValid()) {
                  context.setUser({
                    ...context.user,
                    address: {
                      zipCode: address.zipCode.value,
                      street: address.street.value,
                      city: address.city.value
                    },
                    firstName: firstName.value,
                    lastName: lastName.value
                  })
                  setIsPaymentVisible(true);
                } else {
                  setIsPaymentVisible(false);
                }
              }}
            >
              <Text style={{ fontSize: deviceWidth * 0.05 }}>Add Payment</Text>
            </TouchableOpacity>
            {isPaymentVisible ? (
              <AddPayment
                isVisible={isPaymentVisible}
                setVisible={setIsPaymentVisible}
                setLoginVisible={setLoginVisible}
              />
            ) : null}
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
    width: "100%",
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
