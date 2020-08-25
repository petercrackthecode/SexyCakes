import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  Button,
} from "react-native";
import {
  mobileStyles as styles,
  deviceHeight,
  deviceWidth,
  MAIN_THEME_COLOR,
} from "../styles/mobile";
import { withAuth } from "./Context/AuthContext";

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faChevronRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "./Login/Login";
import { Rewards } from "./AccountList/Rewards";
import { Profile } from "./AccountList/Profile";
import { Payment } from "./AccountList/Payment";
import { GlobalContext } from "./Context/globalContext";

const Stack = createStackNavigator();

const itemsList = [
  "Orders",
  "Profile",
  "Payment Methods",
  "Rewards",
  "Logout",
].map((item, id) => ({
  item: item,
  id: id,
}));

const Link = ({ item, navigation }) => {
  return (
    <GlobalContext.Consumer>
      {(globalContext) => (
        <TouchableOpacity
          style={{ ...localStyles.link, ...styles.rowContainer }}
          onPress={() => {
            globalContext.setGlobalState({
              ...globalContext,
              isMainHeaderVisible: false
            });
            navigation.navigate(item);
          }}
        >
          <View style={{ float: "left" }}>
            <Text style={{ fontSize: deviceWidth * 0.05 }}>{item}</Text>
          </View>
          <View style={{ float: "right" }}>
            <FontAwesomeIcon icon={faChevronRight} size={deviceWidth * 0.05} color='black'/>
          </View>
        </TouchableOpacity>
      )}
    </GlobalContext.Consumer>
  );
};

function AccountList({ navigation }) {
  const renderItem = ({ item }) => (
    <Link item={item.item} navigation={navigation} />
  );
  return (
    <withAuth.Consumer>
      {(context) => {
        return (
          <View style={{ ...styles.fullPageContainer, paddingTop: 0 }}>
            <View
              style={{
                ...localStyles.avatar,
                display: context.isLoggedIn ? "flex" : "none",
              }}
            >
              <Image
                source={{
                  uri:
                    context.avatar === ""
                      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQxuowyaQzhttbJEHIgSmAK-DOieEP6ixmpBA&usqp=CAU"
                      : context.avatar,
                }}
                style={{ ...localStyles.profilePicture }}
                resizeMode={"cover"}
              />
              <View
                style={{
                  ...styles.columnContainer,
                  paddingLeft: deviceWidth * 0.1,
                }}
              >
                <Text
                  style={{ fontWeight: "500", fontSize: deviceWidth * 0.05 }}
                >{`${context.firstName} ${context.lastName}`}</Text>
                <View
                  style={{
                    ...styles.rowContainer,
                    justifyContent: "flex-start",
                    width: "100%",
                    marginTop: 10,
                  }}
                >
                  <FontAwesomeIcon icon={faStar} size={deviceWidth * 0.07} color={MAIN_THEME_COLOR}/>
                  <Text
                    style={{ paddingLeft: 10, fontSize: deviceWidth * 0.06 }}
                  >
                    {context.stars}
                  </Text>
                </View>
              </View>
            </View>
            <FlatList
              style={{ width: "100%" }}
              data={itemsList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        );
      }}
    </withAuth.Consumer>
  );
}

export default function Account() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  return (
    <withAuth.Consumer>
      {(context) =>
        context.isLoggedIn ? (
          <Stack.Navigator initialRouteName="Account">
            <Stack.Screen name="Account" component={AccountList} />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Payment Methods"
              component={Profile}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Rewards"
              component={Rewards}
              options={{ headerShown: true }}
            />
          </Stack.Navigator>
        ) : (
          <View
            style={{
              ...styles.fullPageContainer,
              marginTop: -deviceHeight * 0.1,
            }}
          >
            <Text style={{ fontSize: deviceWidth * 0.05 }}>
              Login/Sign up to buy products, view your orders, and earn
              rewards.👇
            </Text>
            <TouchableOpacity
              style={{ ...localStyles.button }}
              onPress={() => setIsLoginVisible(true)}
            >
              <Text>Login/Sign up</Text>
            </TouchableOpacity>
            <Login
              isVisible={isLoginVisible}
              setIsVisible={setIsLoginVisible}
            />
          </View>
        )
      }
    </withAuth.Consumer>
  );
}

const localStyles = StyleSheet.create({
  link: {
    width: "100%",
    padding: deviceHeight * 0.025,
  },
  avatar: {
    width: "100%",
    paddingVertical: deviceHeight * 0.025,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  profilePicture: {
    borderRadius: deviceWidth * 0.2,
    width: deviceWidth * 0.4,
    height: deviceWidth * 0.4,
  },
  button: {
    backgroundColor: MAIN_THEME_COLOR,
    borderRadius: deviceWidth * 0.05,
    padding: 10,
    marginTop: deviceHeight * 0.02,
  },
});
