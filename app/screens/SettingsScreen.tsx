// screens/SettingsScreen.js
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createUser as createUserDB } from "../db/user";
import useStorage from "../../hooks/useStorage";
import {
  View,
  Text,
  Heading,
  FormControl,
  Input,
  Button,
  Toast,
} from "native-base";
import { useUser } from "../../hooks/useUser";

const SettingsScreen = () => {
  const [username, setUsername] = useState("");
  const { user } = useUser();
  const { setItem } = useStorage();

  const { mutate: createUser } = useMutation({
    mutationFn: (username) => createUserDB(username),
    onSuccess: async (userId) => {
      // await setItem("userId", userId);
      // Navigate to Home Screen
    },
    onError: (error) => {
      Toast.show({
        title: "Error",
        description: "Failed to create user.",
        status: "error",
      });
      console.error("Error creating user:", error);
    },
  });

  const handleSave = async () => {
    if (!username) {
      Toast.show({
        title: "Error",
        description: "Please enter a user name.",
        status: "error",
      });
      return;
    }

    createUser(username);
  };

  return (
    <View style={{ flex: 1 }}>
      <Heading>Settings</Heading>
      <Heading>User</Heading>
      <Text>{user ? "Logged in" : "Not logged in"}</Text>
      <FormControl>
        <FormControl.Label>User Name</FormControl.Label>
        <Input onChangeText={setUsername} placeholder="Enter user name" />
      </FormControl>
      <Button onPress={handleSave}>Save</Button>
    </View>
  );
};

export default SettingsScreen;
