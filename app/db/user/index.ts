import { db } from "../index";

const addUser = (username) => {
  try {
    const result = db.runSync("INSERT INTO Users (username) VALUES (?);", [
      username,
    ]);
    console.log("User added with ID:", result.lastInsertRowId);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const getUserById = (id) => {
  try {
    const user = db.getFirstSync("SELECT * FROM Users WHERE id = ?;", [id]);
    if (user) {
      console.log("User:", user);
      return user;
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
};

const getAllUsers = () => {
  try {
    const users = db.getAllSync("SELECT * FROM Users;");
    users.forEach((user) => console.log("User:", user));
    return users;
  } catch (error) {
    console.error("Error retrieving users:", error);
    return [];
  }
};

const updateUser = (id, newUsername) => {
  try {
    const result = db.runSync("UPDATE Users SET username = ? WHERE id = ?;", [
      newUsername,
      id,
    ]);
    console.log("Rows affected:", result.changes);
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const deleteUser = (id) => {
  try {
    const result = db.runSync("DELETE FROM Users WHERE id = ?;", [id]);
    console.log("Rows deleted:", result.changes);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Export CRUD functions for use in other parts of the app
export { addUser, getUserById, getAllUsers, updateUser, deleteUser };
