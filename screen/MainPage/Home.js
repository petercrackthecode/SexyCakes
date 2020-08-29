import React, { Fragment } from "react";
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
const algoliasearch = require("algoliasearch");
import {
  GlobalContextProvider,
  GlobalContext,
} from "../../components/Context/globalContext";
import {ProvideAuth, withAuth} from '../../components/Context/AuthContext';
import { Entypo, MaterialCommunityIcons, Foundation } from '@expo/vector-icons';
import { InstantSearch } from "react-instantsearch-native";
import SearchBox from "../../components/Search";
import Cart from "../../components/Cart";
import Account from "../../components/Account";
import Items from "../../components/Items";

const zipCodes = require("zipcodes");

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {useIsFocused} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const DATA = [
  {
    type: "stores",
    id: "1",
  },
];

const searchClient = algoliasearch(
  "6U6YMVK0BE",
  "64c2fecd13dc358cb3ff440fc4865350"
);

function Shopping({ navigation }) {
  return (
    <withAuth.Consumer>
      {(context) => {
        return (
          <View
            style={{
              ...styles.fullPageContainer,
              justifyContent: "flex-start",
              paddingTop: -deviceHeight * 0.2,
              paddingHorizontal: 0,
            }}
          >
            <InstantSearch searchClient={searchClient} indexName="Sexycakes">
              <SearchBox
                width={deviceWidth * 0.8}
                placeholder="Search Grub"
              />
              <FlatList
                data={DATA}
                ListEmptyComponent={() => <Text>No item available</Text>}
                renderItem={() => (
                  <Items/>
                )}
                keyExtractor={(item) => item.id}
              />
            </InstantSearch>
          </View>
        );
      }}
    </withAuth.Consumer>
  );
}

function CartIcon({ notifications, focused }) {
  return (
    <View>
      <Foundation name="shopping-cart" size={deviceWidth * (focused ? 0.11 : 0.1)} color={focused ? MAIN_THEME_COLOR : "gray"} />
      {notifications > 0 && (
        <View
          style={{
            position: "absolute",
            right: "-1%",
            top: "-1%",
            backgroundColor: "red",
            borderRadius: "50%",
            width: deviceWidth * 0.04,
            height: deviceWidth * 0.04,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
            {notifications}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function Home({ navigation, route }) {
  return (
    <GlobalContext.Consumer>
      {(context) => (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === "Shopping") {
                return (
                  <Entypo name="home" size={deviceWidth * (focused ? 0.11 : 0.1)} color={focused ? MAIN_THEME_COLOR : "gray"} />
                );
              } else if (route.name === "Cart") {
                return (
                  <CartIcon
                    notifications={Object.keys(context.cart).length}
                    focused={focused}
                  />
                );
              } else {
                return (
                  <MaterialCommunityIcons name="account" size={deviceWidth * (focused ? 0.11 : 0.1)} color={focused ? MAIN_THEME_COLOR : "gray"} />
                );
              }
            },
          })}
          tabBarOptions={{
            showLabel: false,
            swipeEnabled: false,
            tabStyle: {
              borderTopWidth: 0.5,
              borderTopColor: 'black',
              paddingTop: 5
            }
          }}
          initialRouteName="Shopping"
          style={{ backgroundColor: "blue" }}
        >
          <Tab.Screen name="Shopping">
            {() => <Shopping context={context}/>}
          </Tab.Screen>
          <Tab.Screen name="Cart">
            {() => <Cart context={context} navigation={navigation}/>}
          </Tab.Screen>
          <Tab.Screen name="Account">
            {() => <Account context={context}/>}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </GlobalContext.Consumer>
  );
}

const localStyles = StyleSheet.create({
  bannerImage: {
    width: deviceWidth * 0.3,
    height: deviceHeight * 0.2,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: deviceWidth * 0.056,
    color: "white",
  },
  gridText: {
    fontSize: deviceWidth * 0.03,
    color: "white",
  },
});
