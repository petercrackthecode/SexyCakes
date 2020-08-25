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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faShoppingCart, faUser, faHome } from '@fortawesome/free-solid-svg-icons';
import { InstantSearch, Configure } from "react-instantsearch-native";
import SearchBox from "../../components/Search";
import Stores from "../../components/Stores";
import Cart from "../../components/Cart";
import Account from "../../components/Account";

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

// the default distance to scan around the latitude and longitude
const DEFAULT_RADIUS = 20000;

// convert the current zip code to Latitude and longtitude
const zipCodesToLatLong = (zip) => {
  const result = zipCodes.lookup(zip);

  return {
    latitude: result.latitude,
    longitude: result.longitude,
  };
};

function Banner() {
  return (
    <View
      style={{
        ...styles.rowContainer,
        width: deviceWidth,
        height: deviceHeight * 0.3,
        marginVertical: deviceHeight * 0.05,
      }}
    >
      <View
        style={{ width: "30%", height: "100%", backgroundColor: "transparent" }}
      ></View>
      <View
        style={{
          ...styles.columnContainer,
          width: "70%",
          height: "100%",
          backgroundColor: MAIN_THEME_COLOR,
          paddingHorizontal: "12%",
        }}
      >
        <View style={{ marginBottom: 5 }}>
          <Text style={localStyles.titleText}>Tap. Order. Smile.</Text>
        </View>
        <Text style={localStyles.gridText}>
          Bringing you the brands you love, fast and easy.
        </Text>
      </View>
      <View style={{ position: "absolute", start: deviceWidth * 0.12 }}>
        <Image
          source={require("../../assets/images/Shipping.png")}
          style={localStyles.bannerImage}
        />
      </View>
    </View>
  );
}

const searchClient = algoliasearch(
  "6U6YMVK0BE",
  "64c2fecd13dc358cb3ff440fc4865350"
);

function Shopping({ navigation }) {
  return (
    <withAuth.Consumer>
      {(context) => {
        const {latitude, longitude} = zipCodesToLatLong(context.address.zipCode);
        return (
          <View
            style={{
              ...styles.fullPageContainer,
              justifyContent: "flex-start",
              paddingTop: -deviceHeight * 0.2,
              paddingHorizontal: 0,
            }}
          >
            <InstantSearch searchClient={searchClient} indexName="stores">
              <SearchBox
                width={deviceWidth * 0.8}
                placeholder="Search Stores"
              />
              <Configure aroundLatLng={`${latitude}, ${longitude}`} aroundRadius={DEFAULT_RADIUS}/>
              <FlatList
                data={DATA}
                ListEmptyComponent={() => <Text>No item available</Text>}
                ListHeaderComponent={() => <Banner />}
                renderItem={(item) => (
                  <Stores
                    navigation={navigation}
                    zipCode={context.address.zipCode}
                  />
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
      <FontAwesomeIcon
        icon={faShoppingCart}
        size={deviceWidth * (focused ? 0.11 : 0.1)}
        color={focused ? MAIN_THEME_COLOR : "gray"}
      />
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
                  <FontAwesomeIcon
                    icon={faHome}
                    size={deviceWidth * (focused ? 0.11 : 0.1)}
                    color={focused ? MAIN_THEME_COLOR : "gray"}
                  />
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
                  <FontAwesomeIcon
                    icon={faUser}
                    size={deviceWidth * (focused ? 0.11 : 0.1)}
                    color={focused ? MAIN_THEME_COLOR : "gray"}
                  />
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
          <Tab.Screen name="Shopping" component={Shopping} />
          <Tab.Screen name="Cart" component={Cart} />
          <Tab.Screen name="Account" component={Account} />
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
