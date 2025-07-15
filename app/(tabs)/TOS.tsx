import { ScrollView, StyleSheet, Text } from 'react-native';

export default function TOS() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Terms of Service</Text>

      <Text style={styles.sectionTitle}>1. Purpose</Text>
      <Text style={styles.paragraph}>
        This app is intended for educational and entertainment purposes only. It is designed to help users understand card counting concepts and basic blackjack strategy. It is not intended to be used for gambling or as a tool in live casino environments.
      </Text>

      <Text style={styles.sectionTitle}>2. No Liability</Text>
      <Text style={styles.paragraph}>
        The developer of this app assumes no responsibility or liability for any losses, damages, or consequences incurred as a result of using the app. Use this app at your own risk.
      </Text>

      <Text style={styles.sectionTitle}>3. Age Restriction</Text>
      <Text style={styles.paragraph}>
        This app is not intended for users under the age of 18. Users should comply with local laws regarding the use of content related to gambling or casino gaming.
      </Text>

      <Text style={styles.sectionTitle}>4. Data and Privacy</Text>
      <Text style={styles.paragraph}>
        This app does not collect, store, or share any personal user data. All inputs remain on your device and are used solely for the app’s core functionality.
      </Text>

      <Text style={styles.sectionTitle}>5. Ads and Purchases</Text>
      <Text style={styles.paragraph}>
        This app is supported by advertisements. An optional in-app purchase is available to remove ads. Ad content is served by third-party providers and may be subject to their own terms and privacy policies.
      </Text>

      <Text style={styles.sectionTitle}>6. Prohibited Use</Text>
      <Text style={styles.paragraph}>
        You may not use this app in any unlawful manner or in violation of any applicable laws or regulations, including but not limited to using it at casino tables or in real-money gambling situations.
      </Text>

      <Text style={styles.sectionTitle}>7. Contact</Text>
      <Text style={styles.paragraph}>
        For questions, feedback, or support, contact:{"\n"}
        <Text style={styles.bold}>hilocardcounter@gmail.com</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
});