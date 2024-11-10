import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useStorage() {
  const setItem = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  const getItem = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const removeItem = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  };

  return { setItem, getItem, removeItem };
}
