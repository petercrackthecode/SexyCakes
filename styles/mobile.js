import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width,
  deviceHeight = Dimensions.get("window").height;

const MAIN_THEME_COLOR = "#64BACB";

const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  titletext: {
    color: "black",
    fontSize: deviceWidth * 0.07,
    fontWeight: "bold",
    fontFamily: "Avenir-bold",
  },
  fullPageContainer: {
    backgroundColor: "white",
    paddingHorizontal: deviceWidth * 0.05,
    paddingVertical: deviceHeight * 0.05,
    width: deviceWidth,
    height: deviceHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  gridtext: {
    color: "black",
    fontSize: deviceWidth * 0.05,
    marginTop: 10,
    fontWeight: "100",
    fontFamily: "Avenir-normal",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 24,
  },
  textInput: {
    borderWidth: 0.5,
    padding: 5,
    margin: 5,
    minWidth: "100%",
    fontSize: 20,
  },
  warningText: {
    color: "red",
    fontWeight: "bold",
    fontSize: deviceWidth * 0.04,
  },
  columnContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    position: "absolute",
    top: deviceHeight * 0.1,
    left: deviceWidth * 0.07,
  },
});

module.exports = {
  MAIN_THEME_COLOR: MAIN_THEME_COLOR,
  deviceHeight: deviceHeight,
  deviceWidth: deviceWidth,
  mobileStyles: mobileStyles,
};
