// screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { Button, Text, View, Box, Spacer, Stack } from "native-base";

import { decks } from "../../mockData/decks"; // Import the mock decks

import theme from "../../components/theme";

import { getAllUsers } from "../db";

// Link to DeckScreen
export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getAllUsers();

        console.log({ users });

        setUsers(users || []);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    }

    fetchUsers();
  }, []);

  const welcomeMessage = users[0]?.username
    ? `Welcome, ${users[0].username}`
    : "Welcome";

  return (
    <Box
      style={{
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Stack
        space={4}
        alignItems="center"
        justifyContent="center"
        style={{ width: "100%" }}
      >
        <Text>{welcomeMessage}</Text>
        <Button onPress={() => navigation.navigate("Practice")}>
          Practice
        </Button>
        <Spacer height={1} />
        <Button onPress={() => navigation.navigate("Decks")}>Decks</Button>
        <Spacer height={1} />
        <Button onPress={() => navigation.navigate("Settings")}>
          Settings
        </Button>
      </Stack>
      {users.map((user) => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </Box>
  );
}
