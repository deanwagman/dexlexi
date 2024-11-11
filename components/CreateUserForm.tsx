import React, { useState } from "react";
import { FormControl, Input, Button, Toast } from "native-base";

const CreateUserForm = ({ createUser }) => {
  const [username, setUsername] = useState("");

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
    <FormControl>
      <FormControl.Label>User Name</FormControl.Label>
      <Input onChangeText={setUsername} placeholder="Enter user name" />
      <Button onPress={handleSave}>Save</Button>
    </FormControl>
  );
};

export default CreateUserForm;
