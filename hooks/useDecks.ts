import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDecks,
  createDeck,
  updateDeck,
  deleteDeck,
  getDeck,
} from "../app/db/decks";
import { getDefaultUser } from "../app/db/user";

export const useDecks = () => {
  return useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      const user = await getDefaultUser();

      console.log({ decskUser: user });

      return getDecks(user.id);
    },
  });
};

export const useCreateDeck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, userId }) => createDeck(name, userId),
    onSuccess: () => {
      queryClient.invalidateQueries("decks");
    },
  });
};

export const useUpdateDeck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deckId, name }) => updateDeck(deckId, name),
    onSuccess: () => {
      queryClient.invalidateQueries("decks");
    },
  });
};

export const useDeleteDeck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deckId) => deleteDeck(deckId),
    onSuccess: () => {
      queryClient.invalidateQueries("decks");
    },
  });
};

export const useDeck = (deckId) => {
  return useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => getDeck(deckId),
  });
};
