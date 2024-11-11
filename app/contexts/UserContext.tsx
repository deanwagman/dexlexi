import React, { createContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useStorage from "../../hooks/useStorage";
import { getUserByUsername } from "../db/user";
import { DEFAULT_USER } from "../../constants";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Fetch user data using the userId
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserByUsername(DEFAULT_USER),
  });

  console.log({ user });

  return (
    <UserContext.Provider value={{ user, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};
