import React, { useState, Fragment } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import {
  mobileStyles as styles,
  deviceHeight,
  deviceWidth,
} from "../../styles/mobile";
import { withAuth } from "../../components/Context/AuthContext";

const zipcodeValidator = (zipcode) => {
  const zipcodeRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  return zipcodeRegex.test(zipcode.toString());
};

export default function Location({ navigation }) {
  const [isZipcodeValid, setIsZipcodeValid] = useState(true);

  const handlePress = (zipCode) => {
    if (zipcodeValidator(zipCode)) {
      setIsZipcodeValid(true);
      navigation.navigate("Home");
    } else {
      setIsZipcodeValid(false);
    }
  };

  const handleTextChange = (value = "", setText) => {
    setText(value);
  };

  return (
    <withAuth.Consumer>
      {(context) => {
        const address = context.address,
          setGlobalState = context.setUser;
        return (
          <Fragment>
            <View style={styles.fullPageContainer}>
              <Text style={styles.titletext}>Enter your zipcode to begin</Text>
              <Text style={styles.gridtext}>
                Looks like you haven't entered a location to shop stores near
                you
              </Text>
              <TextInput
                style={styles.textInput}
                keyboardType={"phone-pad"}
                returnKeyType="done"
                value={address.zipCode}
                onChangeText={(value) =>
                  handleTextChange(value, function (newZipCode) {
                    setGlobalState({
                      ...context,
                      address: {
                        ...address,
                        zipCode: newZipCode,
                      },
                    });
                  })
                }
                autoCorrect={false}
              />
              <Text
                style={{
                  ...styles.warningText,
                  display: isZipcodeValid ? "none" : "flex",
                }}
              >
                Zip Code is invalid
              </Text>
              <Image
                source={require("../../assets/images/Zipcode.png")}
                style={{
                  width: deviceWidth * 0.7,
                  height: deviceHeight * 0.3,
                  marginTop: deviceHeight * 0.1,
                }}
              />
              <TouchableOpacity
                style={{ ...styles.button, ...localStyles.getStartedButton }}
                onPress={() => handlePress(address.zipCode)}
              >
                <Text>Finish</Text>
              </TouchableOpacity>
            </View>
          </Fragment>
        );
      }}
    </withAuth.Consumer>
  );
}

const localStyles = StyleSheet.create({
  getStartedButton: {
    width: 222,
    backgroundColor: "#64BACB",
    borderRadius: 24,
    minHeight: 53,
    marginVertical: deviceHeight * 0.05,
  },
});
