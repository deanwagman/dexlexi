import { Box, Text } from "native-base";

const DeckCover = ({ text }) => {
  return (
    <Box
      bg="white"
      shadow={2}
      rounded="lg"
      width="68.9%"
      height="38vh"
      p={4}
      m={2}
    >
      <Text
        style={{
          fontSize: 36,
          fontWeight: "bold",
          color: "black",
        }}
      >
        {text}
      </Text>
    </Box>
  );
};

export default DeckCover;
