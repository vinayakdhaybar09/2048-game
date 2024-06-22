import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const GameOverlay = ({ onRestart, board }:any) => {
  if (board.hasWon()) {
    return (
      <Image
        source={require("../assets/images/2048.gif")}
        style={styles.gameWon}
      />
    );
  } else if (board.hasLost()) {
    return (
      <Image
        source={require("../assets/images/game-over.gif")}
        style={styles.hasLoast}
      />
    );
  }
};

export default GameOverlay;

const styles = StyleSheet.create({
  gameWon: {
    position:"absolute",
    height: "100%",
    width: "100%",
  },
  hasLoast: {
    position:"absolute",
    height: "100%",
    width: "100%",
  },
});
