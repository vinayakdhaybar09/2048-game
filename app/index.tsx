import BoardView from "@/components/BoardView";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#57407c",
        flex: 1,
        padding: 20,
      }}
    >
      <BoardView />
      <Text style={styles.infoBtn}>
        Swipe left or right, up or down to move the tiles. When two tiles with
        the same number touch, they merge into one. Once you get 2048 in any
        square, you win.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  infoBtn: {
    backgroundColor: "#3d2963",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: "auto",
    gap: 10,
    color: "#ffffff80",
    lineHeight:18
  },
});
