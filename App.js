import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

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
} from "react-native";
import { useFonts } from "@use-expo/font";
import Home from "./screen/MainPage/Home";
import Checkout from "./screen/MainPage/Checkout";
import {
  GlobalContextProvider,
  GlobalContext,
} from "./components/Context/globalContext";
import { ProvideAuth, withAuth } from "./components/Context/AuthContext";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const CUSTOM_PATH_TO_FONTS = "./assets/fonts";

const Stack = createStackNavigator();

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Shopping";
  return routeName;
}

export default function App() {
  useEffect(() => {
    //console.disableYellowBox = true;
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
                      <Stack.Navigator initialRouteName="Home">
                        <Stack.Screen
                          name="Home"
                          component={Home}
                          options={({ route }) => ({
                            headerShown: globalContext.isMainHeaderVisible,
                            headerTitle: getHeaderTitle(route),
                          })}
                        />
                        <Stack.Screen
                          name="Checkout"
                          component={Checkout}
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
