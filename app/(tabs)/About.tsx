import { ScrollView, StyleSheet, Text } from 'react-native';

export default function About() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>About This App</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Hi-Lo Card Counter – Blackjack Trainer</Text> is your simple, fast,
        and intuitive tool for learning and practicing the Hi-Lo card counting system.
      </Text>
      <Text style={styles.paragraph}>
        Whether you're a curious beginner or just want to understand how counting works, this app offers
        a no-fluff way to sharpen your skills. Just tap the cards you see, and the app keeps track of the running
        count, tells you the recommended play based on basic strategy, and suggests an optimal bet.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Features:</Text>{"\n"}
        • Easy card input with a clean interface{"\n"}
        • Automatic running count using the Hi-Lo system{"\n"}
        • Real-time advice based on count and basic strategy{"\n"}
        • Suggested bets to simulate real casino scenarios{"\n"}
        • Designed for education and entertainment — no gambling involved
      </Text>
      <Text style={styles.paragraph}>
        This app is <Text style={styles.bold}>not a live-play assistant</Text> and <Text style={styles.bold}>doesn’t guarantee winnings</Text>, 
        but it will teach you the logic behind card counting and basic strategy in a fun, interactive way.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a472a',
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
});