import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  deviceWidth,
  deviceHeight,
  mobileStyles as styles,
  MAIN_THEME_COLOR
} from "../styles/mobile";

import {connectSearchBox} from 'react-instantsearch-native';

function SearchBox({ currentRefinement, refine, width, placeholder}) {
  const [localStyles, setLocalStyles] = useState({
    search: {
      borderWidth: 1,
      borderColor: MAIN_THEME_COLOR,
      borderRadius: deviceWidth * 0.05,
      padding: deviceHeight * 0.01,
      margin: 0,
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    searchInput: {
      minWidth: "90%",
      marginLeft: deviceWidth * 0.02,
      fontSize: deviceWidth * 0.05,
    },
  });
  return (
    <View style={{ ...localStyles.search, width: width}}>
      <TouchableOpacity>
        <FontAwesomeIcon
          icon={faSearch}
          color={MAIN_THEME_COLOR}
          style={{ backgroundColor: "transparent", minHeight: "100%" }}
        />
      </TouchableOpacity>
      <TextInput
        placeholder={placeholder}
        style={localStyles.searchInput}
        value={currentRefinement}
        onChangeText={value => refine(value)}
        autoCorrect={false}
        clearButtonMode="always"
        autoCapitalize="none"
        onFocus={() => {
            setLocalStyles({...localStyles, search: {
                ...localStyles.search,
                borderWidth: 3
            }});
        }}
        onBlur={() => {
            setLocalStyles({...localStyles, search: {
                ...localStyles.search,
                borderWidth: 2
            }});
        }}
      />
    </View>
  );
}
export default connectSearchBox(SearchBox);