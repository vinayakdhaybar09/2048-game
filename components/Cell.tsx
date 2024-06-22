import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const Cell = () => {
  return <View style={styles.cellBox}></View>;
};

export default Cell;

const styles = StyleSheet.create({
  cellBox: {
    width: 70,
    height: 70,
    backgroundColor: "#342457",
    margin: 5,
    borderRadius: 8,
  },
});
