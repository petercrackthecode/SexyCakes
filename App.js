import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import React, { useState, useEffect } from "react";
import {
  mobileStyles as styles,
  deviceWidth,
  deviceHeight,
} from "./styles/mobile";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  ActivityIndicator,
  LogBox,
} from "react-native";
import { useFonts } from "@use-expo/font";
import Welcome from "./screen/Onboarding/Welcome";
import Location from "./screen/Onboarding/Location";
import Home from "./screen/MainPage/Home";
import StoreView from "./screen/MainPage/StoreView";
import {
  GlobalContextProvider,
  GlobalContext,
} from "./components/Context/globalContext";
import { ProvideAuth, withAuth } from "./components/Context/AuthContext";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const CUSTOM_PATH_TO_FONTS = "./assets/fonts";

const Stack = createStackNavigator();

const zipcodeValidator = (zipcode) => {
  const zipcodeRegex = /^\d{5}$|^\d{5}-\d{4}$/;
  return zipcodeRegex.test(zipcode.toString());
};

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Shopping";
  return routeName;
}

const ChangeZipCode = ({ isZipCodeBeingChanged, setIsZipCodeBeingChanged }) => {
  const [isZipcodeValid, setIsZipcodeValid] = useState(true);
  const [tempZipcode, setTempZipcode] = useState("");

  const handleTextChange = (value = "", setText) => {
    setText(value);
  };

  const handlePress = (zipCode, context) => {
    if (zipcodeValidator(zipCode)) {
      setIsZipcodeValid(true);
      handleTextChange(zipCode, function (value) {
        context.setUser({
          ...context,
          address: {
            ...context.address,
            zipCode: value,
          },
        });
      });
      setIsZipCodeBeingChanged(false);
    } else {
      setIsZipcodeValid(false);
    }
  };

  return (
    <withAuth.Consumer>
      {(context) => (
        <Modal
          visible={isZipCodeBeingChanged}
          animationType="fade"
          transparent={true}
        >
          <View
            style={{
              ...styles.fullPageContainer,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsZipCodeBeingChanged(false)}
              style={{
                position: "absolute",
                top: deviceHeight * 0.05,
                left: deviceHeight * 0.05,
              }}
            >
              <Text style={{ fontSize: deviceWidth * 0.1 }}>X</Text>
            </TouchableOpacity>
            <Text style={{ fontWeight: "bold", fontSize: deviceWidth * 0.07 }}>
              Enter a new zip code
            </Text>
            <TextInput
              style={styles.textInput}
              keyboardType={"phone-pad"}
              returnKeyType="done"
              value={tempZipcode}
              onChangeText={(value) => setTempZipcode(value)}
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
            <TouchableOpacity
              style={{ ...styles.button, ...localStyles.getStartedButton }}
              onPress={() => handlePress(tempZipcode, context)}
            >
              <Text>Finish</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </withAuth.Consumer>
  );
};

function ZipcodeButton({
  zipCode,
  isZipCodeBeingChanged,
  setIsZipCodeBeingChanged,
}) {
  return (
    <TouchableOpacity
      style={{
        ...styles.rowContainer,
        height: "100%",
        padding: 10,
        marginRight: deviceWidth * 0.05,
        justifyContent: "space-between",
      }}
      onPress={() => setIsZipCodeBeingChanged(true)}
    >
      <View style={localStyles.padding}>
        <Text
          style={{
            color: "black",
            fontSize: deviceWidth * 0.05,
            fontWeight: "500",
          }}
        >
          {zipCode}
        </Text>
      </View>
      <FontAwesomeIcon icon={faMapMarkerAlt} style={localStyles.zipCodeIcon} />
    </TouchableOpacity>
  );
}

export default function App() {
  const [isZipCodeBeingChanged, setIsZipCodeBeingChanged] = useState(false);

  useEffect(() => {
    console.disableYellowBox = true;
  }, []);

  let [fontsLoaded] = useFonts({
    "Avenir-bold": require(CUSTOM_PATH_TO_FONTS + "/AvenirLTStd-Black.otf"),
    "Avenir-roman": require(CUSTOM_PATH_TO_FONTS + "/AvenirLTStd-Roman.otf"),
    "Avenir-normal": require(CUSTOM_PATH_TO_FONTS + "/AvenirLTStd-Book.otf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ ...styles.fullPageContainer }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ProvideAuth>
          <GlobalContextProvider>
            <GlobalContext.Consumer>
              {(globalContext) => (
                <withAuth.Consumer>
                  {(context) => (
                    <NavigationContainer style={localStyles.container}>
                      <Stack.Navigator initialRouteName="Welcome">
                        <Stack.Screen
                          name="Welcome"
                          component={Welcome}
                          options={{
                            headerShown: globalContext.isMainHeaderVisible,
                          }}
                        />
                        <Stack.Screen
                          name="Location"
                          component={Location}
                          options={{
                            headerShown: globalContext.isMainHeaderVisible,
                          }}
                        />
                        <Stack.Screen
                          name="Home"
                          component={Home}
                          options={({ route }) => ({
                            headerRight: () => (
                              <ZipcodeButton
                                zipCode={context.address.zipCode}
                                setIsZipCodeBeingChanged={
                                  setIsZipCodeBeingChanged
                                }
                                isZipCodeBeingChanged={isZipCodeBeingChanged}
                              />
                            ),
                            headerLeft: () =>
                              isZipCodeBeingChanged ? (
                                <ChangeZipCode
                                  isZipCodeBeingChanged={isZipCodeBeingChanged}
                                  setIsZipCodeBeingChanged={
                                    setIsZipCodeBeingChanged
                                  }
                                />
                              ) : null,
                            headerShown: globalContext.isMainHeaderVisible,
                            headerTitle: getHeaderTitle(route),
                          })}
                        />
                        <Stack.Screen
                          name="StoreView"
                          component={StoreView}
                          options={{
                            headerShown: globalContext.isMainHeaderVisible,
                          }}
                        />
                      </Stack.Navigator>
                    </NavigationContainer>
                  )}
                </withAuth.Consumer>
              )}
            </GlobalContext.Consumer>
          </GlobalContextProvider>
        </ProvideAuth>
      </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  getStartedButton: {
    width: 222,
    backgroundColor: "#64BACB",
    borderRadius: 24,
    minHeight: 53,
    marginBottom: 40,
  },
  padding: { paddingRight: 5 },
  zipCodeIcon: {
    minHeight: "100%",
  },
});
