import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Modal,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  deviceWidth,
  deviceHeight,
  mobileStyles as styles,
  MAIN_THEME_COLOR,
} from "../styles/mobile";
import { connectInfiniteHits } from "react-instantsearch-native";
import { ViewItem } from "./ViewItem";
import { GlobalContext } from "./Context/globalContext";

function Items({ hits, hasMore, refineNext }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <GlobalContext.Consumer>
      {(context) => (
        <FlatList
          data={hits}
          style={{ flexWrap: "wrap" }}
          numColumns={2}
          keyExtractor={(item) => item.product_id.toString()}
          ListHeaderComponent={
            <ViewItem
              {...context.viewedItem}
              isVisible={isModalVisible}
              setIsVisible={setIsModalVisible}
            />
          }
          onEndReached={() => hasMore && refineNext()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{
                  ...styles.columnContainer,
                  width: deviceWidth * 0.4,
                  height: deviceHeight * 0.3,
                  padding: 5,
                  marginVertical: deviceHeight * 0.05,
                }}
                onPress={() => {
                  context.setGlobalState({
                    ...context,
                    viewedItem: item,
                  });
                  setIsModalVisible(true);
                }}
              >
                <Image
                  source={{
                    uri:
                      typeof item.images === "string"
                        ? item.images
                        : item.images[0],
                  }}
                  style={localStyles.itemImage}
                  resizeMode="contain"
                />
                <Text>{item.title}</Text>
                <Text>{`$${item.price}`}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </GlobalContext.Consumer>
  );
}

const localStyles = StyleSheet.create({
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

export default connectInfiniteHits(Items);
