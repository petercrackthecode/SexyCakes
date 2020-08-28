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

import { AntDesign } from '@expo/vector-icons';
import KeyboardSpacer from "react-native-keyboard-spacer";

import { withAuth } from "../Context/AuthContext";