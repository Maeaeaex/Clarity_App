import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Link } from "expo-router";


type Props = {
  label: string;
  destination: 
    | "/breathingMeditation"
    | "/mantraMeditation"
    | "/bodyScan"
    | "/choose"
    | "/read"
    | "/choose_mantra"
    | "/choose_scan"
    | "/rewards"
    | "/progress"
    | "/profile"
    | "/biofeed"
};

export default function LinkButton({ label, destination }: Props) {
  return (
    <View style={styles.buttonContainer}>
        <Link href={destination} asChild>
            <Pressable style={styles.button}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: "#121212"
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
