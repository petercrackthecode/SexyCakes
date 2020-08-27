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
  Modal,
} from "react-native";
import {
  mobileStyles as styles,
  deviceHeight,
  deviceWidth,
  MAIN_THEME_COLOR,
} from "../../styles/mobile";
import { AntDesign } from "@expo/vector-icons";
import { withAuth } from "../Context/AuthContext";
import { ChangeUserInfo } from "../ChangeUserInfo";

const SATISFIED_GREEN = "#00FA9A",
  SATISFIED_GREEN_WITH_OPACITY = "rgba(0, 250, 154, 0.15)";

export default function Verify({
  isVerifyVisible,
  setVerifyVisible,
  phoneNum,
}) {
  const [verifyCode, setVerifyCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(true),
    [isChangeUserInfoVisible, setUserInfoVisible] = useState(false);

  const checkCode = async (phoneNum, code) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      phoneNum: phoneNum.toString(),
      codeToCheck: code.toString(),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const status = await fetch(
      "https://spyd9htiua.execute-api.us-east-2.amazonaws.com/beta/checksmsverify?phoneNum='+19259222407'&code=08037",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(`result = ${result}`);
        return result;
      })
      .catch((error) => {
        console.log("error", error);
        return "error";
      });

    console.log(`Hi I'm status = ${status}`);

    return status;
  };

  const checkVerify = async (authContext, phoneNum, code) => {
    console.log(`verify code = ${verifyCode}`);
    /*
    await checkCode(phoneNum, code).then((status) => {
      if (status === 'true') {
        setUserInfoVisible(true);
        setIsCodeValid(true);
        authContext.setUser({ ...authContext, phone: phoneNum });
      } else setIsCodeValid(false);
      console.log(`status = ${status}`);
    });
    */
    setUserInfoVisible(true);
    setIsCodeValid(true);
    authContext.setUser({ ...authContext, phone: phoneNum });
  };

  return (
    <withAuth.Consumer>
      {(context) => (
        <Modal visible={isVerifyVisible} animationType="fade">
          <View
            style={{
              ...styles.fullPageContainer,
              paddingTop: -deviceHeight * 0.1,
            }}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setVerifyVisible(false)}
            >
              <AntDesign
                name="arrowleft"
                size={deviceWidth * 0.07}
                color="black"
              />
            </TouchableOpacity>
            <Text style={{ ...styles.titletext }}>Verify your number</Text>
            <View style={{ padding: 2, boxSizing: "border-box" }}>
              <Text style={{ ...styles.gridtext, color: "gray" }}>
                We've sent a verification code to your phone. Didn't receive it?{" "}
              </Text>
              <TouchableOpacity style={localStyles.sendAgainButton}>
                <Text style={{ fontSize: deviceWidth * 0.05 }}>Send again</Text>
              </TouchableOpacity>
            </View>
            <View style={localStyles.inputBox}>
              <TextInput
                style={localStyles.inputField}
                keyboardType={"numeric"}
                returnKeyType="done"
                onChangeText={(value) => setVerifyCode(value)}
                value={verifyCode}
                autoFocus={true}
                autoCorrect={false}
              />
              <TouchableOpacity
                style={localStyles.verifyCodeButton}
                onPress={() => checkVerify(context, phoneNum, verifyCode)}
              >
                <Text>Verify code</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                ...styles.warningText,
                display: isCodeValid ? "none" : "flex",
              }}
            >
              The code is invalid
            </Text>
            <ChangeUserInfo
              isVisible={isChangeUserInfoVisible}
              setVisible={setUserInfoVisible}
            />
          </View>
        </Modal>
      )}
    </withAuth.Consumer>
  );
}

const localStyles = StyleSheet.create({
  sendAgainButton: {
    position: "absolute",
    bottom: 2,
    right: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 2,
  },
  inputBox: {
    width: "95%",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    padding: 0,
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 20,
  },
  inputField: {
    height: "100%",
    paddingVertical: 0,
    fontSize: 24,
    width: "60%",
    // backgroundColor: "red",
  },
  verifyCodeButton: {
    backgroundColor: SATISFIED_GREEN,
    borderRadius: 7,
    justifyContent: "center",
    paddingHorizontal: deviceWidth * 0.05,
    position: "absolute",
    right: -5,
    bottom: -2,
    height: "100%",
    width: "35%",
  },
});
