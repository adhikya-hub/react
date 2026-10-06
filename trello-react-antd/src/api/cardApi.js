import trelloApi from "./trello";

export async function getListCards(listId) {
  const response = await trelloApi.get(`/lists/${listId}/cards`);
  return response.data;
}

export async function createCard(listId, name) {
  const response = await trelloApi.post("/cards", null, {
    params: {
      idList: listId,
      name,
    },
  });
  return response.data;
}

export async function renameCard(cardId, name) {
  const response = await trelloApi.put(`/cards/${cardId}`, null, {
    params: {
      name,
    },
  });
  return response.data;
}

export async function archiveCard(cardId) {
  const response = await trelloApi.put(`/cards/${cardId}`, null, {
    params: {
      closed: true,
    },
  });
  return response.data;
}
