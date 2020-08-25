import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  Button
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

export function Payments({navigation}) {
    return (
        <View>
            <Text>This page is under an development</Text>
            <Button title='go back' onPress={() => navigation.goBack()}/>
        </View>
    );
}