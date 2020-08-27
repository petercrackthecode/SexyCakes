import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import {
  mobileStyles as styles,
  deviceHeight,
  deviceWidth,
  MAIN_THEME_COLOR,
} from "../../styles/mobile";
import { AntDesign, Entypo } from '@expo/vector-icons';
import { withAuth } from "../Context/AuthContext";
import Verify from "./Verify";

const sendSmsVerify = async (phoneNum) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({ phoneNum: phoneNum.toString() });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const status = await fetch(
    "https://spyd9htiua.execute-api.us-east-2.amazonaws.com/beta/sendsmsverify",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  return status;
};

const SATISFIED_GREEN = "#00FA9A",
  SATISFIED_GREEN_WITH_OPACITY = "rgba(0, 250, 154, 0.15)";

let AREA_CODE = "1";

export function Login({ isVisible, setIsVisible }) {
  const [parsedPhoneNum, setParsedPhoneNum] = useState(""),
    [isPhoneNumValid, setIsPhoneNumValid] = useState(true),
    [isVerifyVisible, setIsVerifyVisible] = useState(false),
  [isMessageBeingSent, setSendStatus] = useState(false);

  const formatNum = (num) => {
    let formattedNum = "";

    for (let index = 0; index < num.length; ++index) {
      switch (index) {
        case 0:
          formattedNum += "(";
          break;
        case 2:
          formattedNum += num[index] + ") ";
          break;
        case 6:
          formattedNum += "-";
          break;
        default:
          break;
      }
      if (index != 2) formattedNum += num[index];
    }

    return formattedNum;
  };

  const parsedNumToTrueNum = (parsedNum) => {
    const trueNum = parsedNum.split("").filter(isNumKey).join("");
    return trueNum;
  };

  const sendCode = async () => {
    if (parsedPhoneNum.length >= 14) {
      setIsPhoneNumValid(true);

      const TRUE_PHONE_NUM = "+1" + AREA_CODE + parsedNumToTrueNum(parsedPhoneNum);

      setSendStatus(true);
      await sendSmsVerify(TRUE_PHONE_NUM);
      setSendStatus(false);

      setIsVerifyVisible(true);
    } else setIsPhoneNumValid(false);
  };

  const isNumKey = (key) => {
    return "0" <= key && key <= "9";
  };

  const deleteNum = () => {
    if (parsedPhoneNum.length >= 1) {
      const newPhoneNum = parsedNumToTrueNum(parsedPhoneNum).slice(0, -1);

      setParsedPhoneNum(formatNum(newPhoneNum));
    }
  };

  const addNum = (key) => {
    if (parsedPhoneNum.length < 14 && isNumKey(key)) {
      let newPhoneNum = parsedNumToTrueNum(parsedPhoneNum);
      newPhoneNum += key;
      setParsedPhoneNum(formatNum(newPhoneNum));
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View
        style={{ ...styles.fullPageContainer, paddingTop: -deviceHeight * 0.1 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setIsVisible(false)}
        >
          <AntDesign name="arrowleft" size={deviceWidth * 0.07} color="black" />
        </TouchableOpacity>
        <View
          style={{
            borderRadius: 30,
            padding: 10,
            backgroundColor: SATISFIED_GREEN_WITH_OPACITY,
          }}
        >
          <Entypo name="lock" size={deviceWidth * 0.07} color={SATISFIED_GREEN} />
        </View>
        <Text
          style={{
            fontSize: deviceWidth * 0.05,
            marginVertical: deviceHeight * 0.02,
          }}
        >
          Enter your phone number
        </Text>
        <View style={localStyles.inputBox}>
          <Text style={{ fontSize: 30, marginTop: 10 }}>🇺🇸</Text>
          <TextInput
            style={localStyles.inputField}
            keyboardType={"numeric"}
            returnKeyType="done"
            autoFocus={true}
            autoCorrect={false}
            value={parsedPhoneNum}
            onKeyPress={({ nativeEvent }) => {
              nativeEvent.key === "Backspace"
                ? deleteNum()
                : addNum(nativeEvent.key);
            }}
          />
          <TouchableOpacity
            style={localStyles.sendCodeButton}
            onPress={sendCode}
          >
            {isMessageBeingSent ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text>Send code</Text>
            )}
          </TouchableOpacity>
        </View>
        <Text
          style={{
            ...styles.warningText,
            display: isPhoneNumValid ? "none" : "flex",
          }}
        >
          Invalid phone number
        </Text>
      </View>
      <Verify
        isVerifyVisible={isVerifyVisible}
        setVerifyVisible={setIsVerifyVisible}
        phoneNum={`+${AREA_CODE}${parsedNumToTrueNum(parsedPhoneNum)}`}
      />
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  inputBox: {
    width: "95%",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    padding: 0,
    flexDirection: "row",
    marginBottom: 10,
  },
  inputField: {
    height: "100%",
    paddingVertical: 0,
    fontSize: 24,
    width: "60%",
    // backgroundColor: "red",
  },
  sendCodeButton: {
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
