import {StyleSheet} from 'react-native';

const MAIN_BACKGROUND_COLOR = "#43bccc",
  NAVBAR_PADDING = "5vw";

export const globalStyles = StyleSheet.create({

  input: {
    borderWidth: 2,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
  navbar: {
    height: 50,
    backgroundColor: "#ffffff",
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    display: "block",
    paddingLeft: NAVBAR_PADDING,
    paddingRight: NAVBAR_PADDING,
    /*justifyContent: "center"*/
  },
  navbarcontainer: {
    width: 300,
    height: "auto",
    flexWrap: "wrap",
    flex: 1,
    flexDirection: "row",
    paddingLeft: 20,
    padding: 10,
  },
  authenticationButton: {
    width: 200,
    height: "auto",
    flexWrap: "wrap",
    flex: 1,
    flexDirection: "row",
    paddingLeft: 20,
    padding: 10,
    justifyContent: "space-between",
  },
  outercontainer: {
    marginTop: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  alert: {
    backgroundColor: "green",
    color: "white",
    width: "50%",
    alignSelf: "center",
  },
  fullPageContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh'
  },
  rowContainer: {
    height: 800,
    justifyContent: "space-evenly",
    flexDirection: "row",
    paddingTop: 50,
    flexWrap: "wrap",
    flex: 1
  },
  columnContainer: {
    width: 900,
    justifyContent: "center",
    alignItems: 'center',
    flexDirection: "column",
    paddingTop: 50,
  },
  item: {
    backgroundColor: "transparent",
    padding: 15,
    width: 275,
    height: 275,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  content: {
    marginBottom: 30,
  },
  gridtext: {
    color: "black",
    fontSize: 18,
    marginTop: 10,
  },
  titletext: {
    color: "black",
    fontSize: 32,
    fontWeight: "bold",
  },
  imagecontainer: {
    justifyContent: "center",
    alignContent: "center",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
  },
  textInput: {
    border: '1px solid black',
    borderRadius: 10,
    padding: 5,
    margin: 5,
    fontSize: '1.3em',
  },
});


export default MAIN_BACKGROUND_COLOR;