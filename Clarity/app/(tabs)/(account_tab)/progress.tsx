import { View, StyleSheet, Text } from 'react-native';

export default function Rewards() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.bigger}>
        Clarity Score
        </Text>
        <Text style={styles.explanation}></Text>
        <Text style={styles.explanation}>
          See your meditation progress over the last 5 weeks.
          Anyway we are proud of you!
        </Text>
      </View>
    
      <View style={styles.textFootContainer}>
        <Text style={styles.bigger}>
          +20% increase in meditation performance
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#152238",
    padding: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  explanation: {
    fontSize: 15,
    color: "#FFF",
    textAlign: "justify",
  },
  textFootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    fontSize: 30, // ich hinzugefügt
  },
  bigger: {
    fontSize: 20,
    color: "#FFF",
  },
});