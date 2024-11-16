// db/users.js

import { getDb } from "../index";
import { DEFAULT_USER } from "../../../constants";

const createUser = async (username) => {
  try {
    const db = await getDb();
    await db.runAsync("INSERT INTO Users (username) VALUES (?);", [username]);
    console.log("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const getUserById = async (id) => {
  try {
    const db = await getDb();
    const result = await db.getFirstAsync("SELECT * FROM Users WHERE id = ?;", [
      id,
    ]);
    if (result) {
      console.log("User:", result);
      return result;
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
};

const getAllUsers = async () => {
  try {
    const db = await getDb();
    const users = await db.getAllAsync("SELECT * FROM Users;");
    users.forEach((user) => console.log("User:", user));
    return users;
  } catch (error) {
    console.error("Error retrieving users:", error);
    return [];
  }
};

const updateUser = async (id, newUsername) => {
  try {
    const db = await getDb();
    await db.runAsync("UPDATE Users SET username = ? WHERE id = ?;", [
      newUsername,
      id,
    ]);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const deleteUser = async (id) => {
  try {
    const db = await getDb();
    await db.runAsync("DELETE FROM Users WHERE id = ?;", [id]);
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

const getUserByUsername = async (username) => {
  try {
    const db = await getDb();
    const user = await db.getFirstAsync(
      "SELECT * FROM Users WHERE username = ?;",
      [username],
    );
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

const getDefaultUser = async () => {
  return getUserByUsername(DEFAULT_USER);
};

// Export CRUD functions for use in other parts of the app
export {
  createUser,
  getUserById,
  getUserByUsername,
  getDefaultUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
