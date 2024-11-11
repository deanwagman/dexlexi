// screens/SettingsScreen.js
import React from "react";
import { View, Text, Heading } from "native-base";
import { useUser } from "../../hooks/useUser";

const SettingsScreen = () => {
  const { user } = useUser();

  console.log({ user });

  return (
    <View style={{ flex: 1 }}>
      <Heading>Settings</Heading>
      <Heading>User</Heading>
      <Text>{user ? "Logged in" : "Not logged in"}</Text>
    </View>
  );
};

export default SettingsScreen;
