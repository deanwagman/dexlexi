import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDecks, createDeck, updateDeck, deleteDeck } from "../app/db/decks";

export const useDecks = (userId) => {
  return useQuery(["decks", userId], () => getDecks(userId));
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
