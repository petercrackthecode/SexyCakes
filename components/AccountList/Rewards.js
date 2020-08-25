import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import {
  mobileStyles as styles,
  deviceHeight,
  deviceWidth,
  MAIN_THEME_COLOR,
} from "../../styles/mobile";
import {
  GlobalContextProvider,
  GlobalContext,
} from "../../components/Context/globalContext";
import { createStackNavigator } from "@react-navigation/stack";

export function Rewards({navigation}) {
    return (
        <View>
            <Text>This page is under an development</Text>
        </View>
    );
}