import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Heading, Text, Stack, Box, Button } from "native-base";

const PracticeSummary = ({ correct, incorrect }) => {
  const navigation = useNavigation();

  return (
    <Stack
      space={4}
      alignItems="center"
      justifyContent="center"
      style={styles.container}
    >
      <Heading style={styles.heading}>Practice Summary</Heading>
      <Box>
        <Text style={styles.correct}>Correct: {correct}</Text>
        <Text style={styles.incorrect}>Incorrect: {incorrect}</Text>
      </Box>
      <Button onPress={() => navigation.navigate("Home")} colorScheme="green">
        Home
      </Button>
    </Stack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    marginBottom: 20,
  },
  correct: {
    fontSize: 16,
    marginBottom: 5,
  },
  incorrect: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default PracticeSummary;
