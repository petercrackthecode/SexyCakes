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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faLock } from "@fortawesome/free-solid-svg-icons";
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

  const checkVerify = async (authContext, phoneNum, code) => {
    setUserInfoVisible(true);
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
              <FontAwesomeIcon icon={faArrowLeft} size={deviceWidth * 0.07} />
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
