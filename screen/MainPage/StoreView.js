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
const algoliasearch = require("algoliasearch");
import {
  GlobalContextProvider,
  GlobalContext,
} from "../../components/Context/globalContext";
import { InstantSearch, Configure } from "react-instantsearch-native";
import SearchBox from "../../components/Search";
import Items from "../../components/Items";

const searchClient = algoliasearch(
  "6U6YMVK0BE",
  "64c2fecd13dc358cb3ff440fc4865350"
);

const DATA= [
  {
    type: 'items',
    id: '1'
  }
];

export default function StoreView({ navigation }) {
  const [isMenProduct, setIsMenProduct] = useState(true);
  const [productType, setProductType] = useState("all");

  const Tag = () => {
    return (
      <View>
        <View
          style={{
            ...styles.rowContainer,
            marginVertical: deviceWidth * 0.05,
            borderRadius: 20,
            borderWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              ...localStyles.genderLabel,
              ...styles.columnContainer,
              paddingVertical: 10,
              borderRadius: isMenProduct ? 20 : 0,
              borderWidth: isMenProduct ? 1 : 0,
              backgroundColor: isMenProduct ? MAIN_THEME_COLOR : "transparent",
            }}
            onPress={() => setIsMenProduct(!isMenProduct)}
          >
            <Text>Men</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...localStyles.genderLabel,
              ...styles.columnContainer,
              paddingVertical: 10,
              borderRadius: isMenProduct ? 0 : 20,
              borderWidth: isMenProduct ? 0 : 1,
              backgroundColor: isMenProduct ? "transparent" : MAIN_THEME_COLOR,
            }}
            onPress={() => setIsMenProduct(!isMenProduct)}
          >
            <Text>Women</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            ...styles.rowContainer,
            marginVertical: deviceWidth * 0.05,
            borderRadius: 20,
            borderWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              ...localStyles.typeLabel,
              ...styles.columnContainer,
              paddingVertical: 10,
              borderRadius: productType === "all" ? 20 : 0,
              borderWidth: productType === "all" ? 1 : 0,
              backgroundColor:
                productType === "all" ? MAIN_THEME_COLOR : "transparent",
            }}
            onPress={() => setProductType("all")}
          >
            <Text>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...localStyles.typeLabel,
              ...styles.columnContainer,
              paddingVertical: 10,
              borderRadius: productType === "shoes" ? 20 : 0,
              borderWidth: productType === "shoes" ? 1 : 0,
              backgroundColor:
                productType === "shoes" ? MAIN_THEME_COLOR : "transparent",
            }}
            onPress={() => setProductType("shoes")}
          >
            <Text>Shoes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...localStyles.typeLabel,
              ...styles.columnContainer,
              paddingVertical: 10,
              borderRadius: productType === "tops" ? 20 : 0,
              borderWidth: productType === "tops" ? 1 : 0,
              backgroundColor:
                productType === "tops" ? MAIN_THEME_COLOR : "transparent",
            }}
            onPress={() => setProductType("tops")}
          >
            <Text>Tops</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...localStyles.typeLabel,
              ...styles.columnContainer,
              paddingVertical: 10,
              borderRadius: productType === "bottoms" ? 20 : 0,
              borderWidth: productType === "bottoms" ? 1 : 0,
              backgroundColor:
                productType === "bottoms" ? MAIN_THEME_COLOR : "transparent",
            }}
            onPress={() => setProductType("bottoms")}
          >
            <Text>Bottoms</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <GlobalContext.Consumer>
      {(context) => (
        <View
          style={{
            ...styles.fullPageContainer,
            justifyContent: "flex-start",
            paddingTop: -deviceHeight * 0.2,
            paddingHorizontal: 0,
          }}
        >
          <InstantSearch searchClient={searchClient} indexName="dev_ULA">
            <SearchBox width={deviceWidth * 0.8} placeholder="Search Stores"/>
            <FlatList style={{ paddingHorizontal: deviceWidth * 0.1 }}
              ListHeaderComponent={<Tag/>}
              data={DATA}
              renderItem={() => <Items/>}
              keyExtractor={(item) => item.id}
            />
          </InstantSearch>
        </View>
      )}
    </GlobalContext.Consumer>
  );
}

const localStyles = StyleSheet.create({
  titleText: {
    fontWeight: "bold",
    fontSize: deviceWidth * 0.056,
    color: "white",
  },
  gridText: {
    fontSize: deviceWidth * 0.03,
    color: "white",
  },
  genderLabel: {
    width: "50%",
  },
  typeLabel: {
    width: "25%",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
});
