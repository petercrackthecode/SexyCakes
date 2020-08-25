import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  mobileStyles as styles,
  deviceHeight,
  deviceWidth,
  MAIN_THEME_COLOR,
} from "../styles/mobile";
import {
  GlobalContextProvider,
  GlobalContext,
} from "../components/Context/globalContext";
import { connectInfiniteHits } from "react-instantsearch-native";

function NearbyStores({ navigation, zipCode, hits, hasMore, refineNext }) {
  const renderStore = (store, context) => {
    return (
      <TouchableOpacity
        style={{ ...styles.rowContainer, ...localStores.store }}
        key={store.Store_id.toString()}
        onPress={() => handlePress(store, context)}
      >
        <View style={{width: '50%'}}>
          <Text style={localStores.titleText}>{store.Store_name}</Text>
          <Text style={localStores.gridText}>
            {store.Store_street_address} | {store.Store_zip_code}
          </Text>
        </View>
        <Image
          source={{ uri: 'https://saymile.com/saymile.png' }}
          resizeMode="contain"
          style={localStores.brandLogo}
        />
      </TouchableOpacity>
    );
  };

  const handlePress = (store, context) => {
    const {setGlobalState}= context;
    setGlobalState({ ...context, currentStore: store });
    navigation.navigate("StoreView");
  };

  return (
    <GlobalContext.Consumer>
      {(context) => (
        <View
          style={{
            ...styles.columnContainer,
            justifyContent: "space-evenly",
            paddingBottom: deviceHeight * 0.2,
          }}
        >
          <View
            style={{
              width: deviceWidth,
              alignItems: "flex-start",
              paddingHorizontal: deviceWidth * 0.1,
              borderBottomColor: "black",
              borderBottomWidth: 1,
            }}
          >
            <Text
              style={{
                ...localStores.titleText,
                fontSize: deviceWidth * 0.07,
              }}
            >
              Nearby
            </Text>
          </View>
          {!hits ? (
            <Text>We are having a problem finding any store near you :(</Text>
          ) : (
            <FlatList
              data={hits}
              renderItem={({ item }) => renderStore(item, context)}
              keyExtractor={(item) => item.Store_id.toString()}
            />
          )}
        </View>
      )}
    </GlobalContext.Consumer>
  );
}

const localStores = StyleSheet.create({
  titleText: {
    fontWeight: "400",
    fontSize: deviceWidth * 0.056,
  },
  gridText: {
    fontSize: deviceWidth * 0.04,
    fontWeight: "200",
  },
  brandLogo: {
    width: '40%',
    height: deviceHeight * 0.15,
    marginLeft: 30,
  },
  store: {
    width: deviceWidth * 0.8,
    paddingVertical: 10,
  },
});

export default connectInfiniteHits(NearbyStores);