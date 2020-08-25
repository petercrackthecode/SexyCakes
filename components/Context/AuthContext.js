import React, { useState, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-community/async-storage";

export const withAuth = createContext();

const DEFAULT_USER_DATA = {
  address: {
    zipCode: "",
    street: "",
    // some cities can share a zip code, so we have to point out the exact city
    city: "",
  },
  stars: 0,
  avatar: "",
  firstName: "Peter",
  lastName: "Nguyen",
  phone: "",
  email: "",
  isLoggedIn: false,
};

export const ProvideAuth = (props) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    (async function fetchUser() {
      try {
        const getUser = await AsyncStorage.getItem("user");
        getUser ? setUser(JSON.parse(getUser)) : setUser(DEFAULT_USER_DATA);
        setUser(DEFAULT_USER_DATA);
      } catch (error) {
        setUser(DEFAULT_USER_DATA);
      }
    })();
  }, []);

  useEffect(() => {
    (async function updateUser() {
      try {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        // saving error
      }
    })();
  }, [user]);

  return (
    <withAuth.Provider value={{ ...user, setUser: setUser }}>
      {props.children}
    </withAuth.Provider>
  );
};
