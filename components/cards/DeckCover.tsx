import { Box, Text } from "native-base";

const DeckCover = ({ text }) => {
  return (
    <Box
      bg="white"
      shadow={2}
      rounded="lg"
      width="100%"
      height="600"
      p={60}
      style={{
        zIndex: 1,
      }}
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
