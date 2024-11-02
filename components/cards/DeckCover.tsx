import React from "react";
import { Box, Text, Image, Pressable } from "native-base";

const DeckCover = ({
  title,
  subtitle,
  description,
  icon,
  imageUri,
  onPress,
  style,
  ...props
}) => {
  console.log({ title, subtitle, description, icon, imageUri });
  return (
    // <Pressable onPress={onPress}>
    <Box
      bg="white"
      shadow={2}
      rounded="lg"
      width="100%"
      maxWidth={400}
      p={6}
      style={style}
      {...props}
    >
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          alt="Deck Image"
          width="100%"
          height={200}
          borderRadius="lg"
          mb={4}
        />
      )}
      {icon && (
        <Box mb={4} alignItems="center">
          {icon}
        </Box>
      )}
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color="black"
        mb={subtitle || description ? 2 : 0}
        textAlign="center"
      >
        {title}
      </Text>
      {subtitle && (
        <Text fontSize="md" color="gray.500" textAlign="center" mb={2}>
          {subtitle}
        </Text>
      )}
      {description && (
        <Text fontSize="lg" color="black" textAlign="center">
          {description}
        </Text>
      )}
    </Box>
    // </Pressable>
  );
};

export default DeckCover;
