import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCards, createCard, updateCard, deleteCard } from "../app/db/cards";

export const useCards = (deckId) => {
  return useQuery({
    queryKey: ["cards", deckId],
    queryFn: () => getCards(deckId),
  });
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deckId, front, back }) => createCard(deckId, front, back),
    onSuccess: () => {
      queryClient.invalidateQueries("cards");
    },
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, front, back }) => updateCard(cardId, front, back),
    onSuccess: () => {
      queryClient.invalidateQueries("cards");
    },
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries("cards");
    },
  });
};
