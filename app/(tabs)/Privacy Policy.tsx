import { ScrollView, StyleSheet, Text } from 'react-native';

export default function Privacy() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Privacy Policy</Text>

      <Text style={styles.sectionTitle}>1. Overview</Text>
      <Text style={styles.paragraph}>
        This app is designed for educational and entertainment purposes and does not collect, store, or share any personally identifiable information from users.
      </Text>

      <Text style={styles.sectionTitle}>2. No Personal Data Collection</Text>
      <Text style={styles.paragraph}>
        We do not collect your name, email address, location, contacts, or any other personal data. All actions performed in the app (such as selecting cards or entering deck size) stay on your device and are not transmitted to any server.
      </Text>

      <Text style={styles.sectionTitle}>3. Third-Party Services</Text>
      <Text style={styles.paragraph}>
        This app displays ads and offers in-app purchases. These services may be provided by third parties such as Google AdMob, which may collect anonymous usage data to serve personalized advertisements.
      </Text>
      <Text style={styles.paragraph}>
        For more details, review their policy:{"\n"}
        https://policies.google.com/technologies/ads
      </Text>

      <Text style={styles.sectionTitle}>4. Children's Privacy</Text>
      <Text style={styles.paragraph}>
        This app is not intended for users under the age of 18. If you are a parent or guardian and believe your child has used this app, please contact us.
      </Text>

      <Text style={styles.sectionTitle}>5. Contact</Text>
      <Text style={styles.paragraph}>
        For questions or concerns, contact:{"\n"}
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