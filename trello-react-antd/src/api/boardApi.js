import trelloApi from "./trello";

export async function getBoardLists(boardId) {
  const response = await trelloApi.get(`/boards/${boardId}/lists`);
  return response.data;
}

export async function createList(boardId, name) {
  const response = await trelloApi.post(`boards/${boardId}/lists`, null, {
    params: {
      name,
    },
  });
  return response.data;
}

export async function renameList(listId, name) {
  const response = await trelloApi.put(`/lists/${listId}`, null, {
    params: {
      name,
    },
  });
  return response.data;
}

export async function deleteList(listId) {
  const response = await trelloApi.put(`/lists/${listId}`, null, {
    params: {
      closed: true,
    },
  });

  return response.data;
}
