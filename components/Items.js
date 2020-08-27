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
        <View style={{marginBottom: deviceHeight * 0.2}}>
          <FlatList
            data={hits}
            style={{ flexWrap: "wrap" }}
            numColumns={2}
            keyExtractor={(item, index) => item.objectID.toString()}
            ListHeaderComponent={
              isModalVisible ? (<ViewItem
                {...context.viewedItem}
                setIsVisible={setIsModalVisible}
                key={Math.floor(Math.random())}
              />) : null
            }
            onEndReached={() => hasMore && refineNext()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{
                    ...styles.columnContainer,
                    width: deviceWidth * 0.4,
                    height: deviceHeight * 0.3,
                    paddingHorizontal: 5,
                  }}
                  onPress={async () => {
                    await context.setGlobalState({
                      ...context,
                      viewedItem: item,
                    });
                    setIsModalVisible(true);
                  }}
                >
                  <Image
                    source={require("../assets/images/sexy_cakes_logo.jpg")}
                    style={localStyles.itemImage}
                    resizeMode="contain"
                  />
                  <Text>{item.name}</Text>
                  <Text>{`$${item.base_price}`}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
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
    height: "60%",
    borderRadius: 10,
  },
});

export default connectInfiniteHits(Items);
