import {
  Button,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import Tile from "./Tile";
import { Board } from "../helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GameOverlay from "./GameOverlay";

const BoardView = () => {
  const [board, setBoard] = useState(new Board());
  const [direction, setDirection] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const direction = determineSwipeDirection(gestureState);
        switch (direction) {
          case "left":
            setDirection(0);
            break;

          case "right":
            setDirection(2);
            break;

          case "up":
            setDirection(1);
            break;

          case "down":
            setDirection(3);
            break;
        }
        // console.log(`Swiped ${direction}`);
      },
    })
  ).current;

  const cells = board.cells.map((row, rowIndex) => {
    return (
      <View key={rowIndex}>
        {row.map((col, colIndex) => {
          return <Cell key={rowIndex * board.size + colIndex} />;
        })}
      </View>
    );
  });

  const tiles = board.tiles
    .filter((tile) => tile.value !== 0)
    .map((t, index) => {
      return <Tile tile={t} key={index} />;
    });

  // const onPanGestureEvent = (event) => {
  //   const { translationX, translationY, state } = event.nativeEvent;

  //   if (state === State.ACTIVE) {
  //     if (Math.abs(translationX) > Math.abs(translationY)) {
  //       if (translationX > 0) {
  //         console.log("Swipe Right");
  //         setDirection(2);
  //       } else {
  //         console.log("Swipe Left");
  //         setDirection(0);
  //       }
  //     } else {
  //       if (translationY > 0) {
  //         console.log("Swipe Down");
  //         setDirection(3);
  //       } else {
  //         console.log("Swipe Up");
  //         setDirection(1);
  //       }
  //     }
  //   }
  // };

  const determineSwipeDirection = (gestureState: PanResponderGestureState) => {
    const { dx, dy } = gestureState;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      // Horizontal swipe
      if (dx > 0) {
        // setDirection(2);
        return "right";
      } else {
        // setDirection(0);
        return "left";
      }
    } else {
      // Vertical swipe
      if (dy > 0) {
        // setDirection(3);
        return "down";
      } else {
        // setDirection(1);
        return "up";
      }
    }
  };

  // console.log("direction", direction);

  const onHandleSwipe = () => {
    if (board.hasWon()) {
      return;
    }

    if (direction === null) {
      return;
    }

    let boardClone = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    );

    let newBoard = boardClone.move(direction);
    setBoard(newBoard);
    setDirection(null);
  };

  useEffect(() => {
    onHandleSwipe();
  }, [direction]);

  const storeHighScore = async () => {
    try {
      await AsyncStorage.setItem("highScore", board.score.toString());
    } catch (e) {
      console.log(e);
    }
  };

  const getHighScore = async () => {
    try {
      const value = await AsyncStorage.getItem("highScore");
      if (value !== null) {
        setHighScore(Number(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (board.score > highScore) {
      storeHighScore();
    }
    getHighScore();
  }, [board.score]);

  const resetGame = () => {
    setBoard(new Board());
  };

  return (
    <View>
      <View style={styles.optionsBox}>
        <View style={styles.newGameBtn}>
          <Text style={styles.newGameText}>High Score : {highScore}</Text>
        </View>
        <TouchableOpacity style={styles.newGameBtn} onPress={resetGame}>
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.scoreText}>{board.score}</Text>
      {/* <GestureHandlerRootView style={{}}>
        <PanGestureHandler onGestureEvent={onPanGestureEvent}>
          <View style={styles.boardViewStyle}>
            <View style={{ flexDirection: "row", position: "absolute" }}>
            {cells}
              {tiles}
            </View>
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView> */}

      <View style={styles.boardViewStyle} {...panResponder.panHandlers}>
        <View style={{ flexDirection: "row" }}>
          {cells}
          {tiles}
          <GameOverlay onRestart={resetGame} board={board} />
        </View>
      </View>
    </View>
  );
};

export default BoardView;

const styles = StyleSheet.create({
  boardViewStyle: {
    flexDirection: "row",
    // position: "relative",
    flexWrap: "wrap",
    height: 320,
    width: 320,
    alignSelf: "center",
  },

  optionsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  newGameBtn: {
    backgroundColor: "#3d2963",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "auto",
    borderRadius: 8,
  },
  newGameText: {
    color: "#ffffff80",
    fontSize: 20,
  },

  scoreText: {
    color: "#ffffff80",
    fontSize: 40,
    textAlign: "center",
    marginVertical: 50,
  },
});
