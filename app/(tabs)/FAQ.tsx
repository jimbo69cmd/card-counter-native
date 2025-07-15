import { ScrollView, StyleSheet, Text } from 'react-native';

export default function FAQ() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Frequently Asked Questions</Text>

      <Text style={styles.question}>How do I use the app?</Text>
      <Text style={styles.answer}>
        1. Enter the <Text style={styles.bold}>shoe size</Text> (number of decks in play).{"\n"}
        2. Set your <Text style={styles.bold}>minimum bet</Text>.{"\n"}
        3. During play:{"\n"}
        - Enter your cards under <Text style={styles.bold}>Your Cards</Text>.{"\n"}
        - Enter the dealer’s upcard under <Text style={styles.bold}>Dealer Upcard</Text>.{"\n"}
        - Enter all other visible cards under <Text style={styles.bold}>Add Visible Cards</Text>.{"\n"}
        4. Press <Text style={styles.bold}>New Hand</Text> after each round to reset for the next hand.
      </Text>

      <Text style={styles.question}>When should I take insurance?</Text>
      <Text style={styles.answer}>
        Only take insurance when the <Text style={styles.bold}>true count is +3 or higher</Text>. Otherwise, insurance is not recommended.
      </Text>

      <Text style={styles.question}>What is the Hi-Lo system?</Text>
      <Text style={styles.answer}>
        The Hi-Lo system assigns values to cards to help estimate the deck balance:{"\n"}
        - 2–6 = +1{"\n"}
        - 7–9 = 0{"\n"}
        - 10–Ace = –1
      </Text>

      <Text style={styles.question}>What is the True Count?</Text>
      <Text style={styles.answer}>
        The <Text style={styles.bold}>True Count</Text> is the Running Count divided by the estimated number of decks remaining.{"\n"}
        This gives a more accurate measure of player advantage.
      </Text>

      <Text style={styles.question}>Does this app guarantee I’ll win at Blackjack?</Text>
      <Text style={styles.answer}>
        No. This app is for <Text style={styles.bold}>educational and entertainment purposes only</Text>.
        It can help you learn card counting and basic strategy but doesn’t guarantee winnings.
      </Text>

      <Text style={styles.question}>Can I use this app in a casino?</Text>
      <Text style={styles.answer}>
        No. This app is not meant for live casino play.{"\n"}
        Using devices at the table is usually against casino rules and could get you banned.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a472a',
    padding: 20,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 16,
  },
  answer: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
});