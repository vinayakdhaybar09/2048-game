import { Animated, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";

const Tile = ({ tile }: { tile: any }) => {
  const fromRow = tile.fromRow();
  const toRow = tile.toRow();
  const fromColumn = tile.fromColumn();
  const toColumn = tile.toColumn();

  const styles = getStyles(
    tile.row,
    tile.column,
    fromRow,
    toRow,
    fromColumn,
    toColumn
  );

  const getDynamicStyle = () => {
    let baseStyle = styles.tileBox;

    if (!tile.mergedInto) {
      baseStyle = { ...baseStyle, ...styles.tilePosition };
    }
    if (tile.mergedInto) {
      baseStyle = { ...baseStyle, ...styles.merged };
    }
    if (tile.hasMoved() && fromRow === toRow) {
      baseStyle = { ...baseStyle, ...styles.afterRowMove };
    }
    if (tile.hasMoved() && fromColumn === toColumn) {
      baseStyle = { ...baseStyle, ...styles.afterColumnMove };
    }

    if (tile.hasMoved()) {
      const animatedTop = useRef(new Animated.Value(80 * fromRow)).current;
      const animatedLeft = useRef(new Animated.Value(80 * fromColumn)).current;
      const scaleAnim = useRef(
        new Animated.Value(tile.isNew() ? 0 : 1)
      ).current;

      useEffect(() => {
        if (tile.isNew()) {
          Animated.sequence([
            Animated.delay(150),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }

        if (fromRow !== toRow) {
          Animated.timing(animatedTop, {
            toValue: 80 * toRow,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
        if (fromColumn !== toColumn) {
          Animated.timing(animatedLeft, {
            toValue: 80 * toColumn,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      }, [
        fromRow,
        toRow,
        fromColumn,
        toColumn,
        animatedTop,
        animatedLeft,
        scaleAnim,
      ]);
      baseStyle = { ...baseStyle, ...{ transform: [{ scale: scaleAnim }] } };
      baseStyle = { ...baseStyle, ...{ top: animatedTop } };
      baseStyle = { ...baseStyle, ...{ left: animatedLeft } };
    }

    return baseStyle;
  };

  const getImage = (imageName: number) => {
    switch (imageName) {
      case 2:
        return require("../assets/images/2.gif");
      case 4:
        return require("../assets/images/4.gif");
      case 8:
        return require("../assets/images/8.gif");
      case 16:
        return require("../assets/images/16.gif");
      case 32:
        return require("../assets/images/32.gif");
      case 64:
        return require("../assets/images/64.gif");
      case 128:
        return require("../assets/images/128.gif");
      case 256:
        return require("../assets/images/256.gif");
      case 512:
        return require("../assets/images/512.gif");
      case 1024:
        return require("../assets/images/1024.gif");
      case 2048:
        return require("../assets/images/2048.gif");
      default:
        return require("../assets/images/4.gif");
    }
  };

  return (
    <>
      <Animated.Image source={getImage(tile.value)} style={getDynamicStyle()} />
    </>
  );
};

export default Tile;

const getStyles = (
  top: any,
  left: any,
  fromRow: any,
  toRow: any,
  fromColumn: any,
  toColumn: any
) => {
  const styles = StyleSheet.create({
    tileBox: {
      width: 70,
      height: 70,
      backgroundColor: "#3fff",
      margin: 5,
      borderRadius: 12,
      position: "absolute",
    },
    tilePosition: {
      top: 80 * top,
      left: 80 * left,
    },
    merged: {
      display: "none",
    },
    afterRowMove: {
      top: 80 * toRow,
    },
    afterColumnMove: {
      left: 80 * toColumn,
    },
  });

  return styles;
};
