import React, { createContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useStorage from "../../hooks/useStorage";
import { getUserById } from "../db/user";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { getItem } = useStorage();
  const [userId, setUserId] = useState(null);

  // Fetch userId from storage when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Error fetching user ID from storage:", error);
      }
    };

    fetchUserId();
  }, [getItem]);

  // Fetch user data using the userId
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  console.log({ user });

  return (
    <UserContext.Provider value={{ user, isLoading, error, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
