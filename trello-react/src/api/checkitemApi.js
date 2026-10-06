import trelloApi from "./trello";

export async function getChecklistItems(checklistId) {
  const response = await trelloApi.get(`/checklists/${checklistId}/checkItems`);

  return response.data;
}

export async function createCheckItem(checklistId, name) {
  const response = await trelloApi.post(
    `/checklists/${checklistId}/checkItems`,
    null,
    {
      params: {
        name,
      },
    },
  );

  return response.data;
}

export async function deleteCheckItem(checklistId, checkItemId) {
  await trelloApi.delete(
    `/checklists/${checklistId}/checkItems/${checkItemId}`,
  );
}

export async function toggleCheckItem(cardId, checkItemId, state) {
  const response = await trelloApi.put(
    `/cards/${cardId}/checkItem/${checkItemId}`,
    null,
    {
      params: {
        state,
      },
    },
  );

  return response.data;
}

export async function renameCheckItem(cardId, checkItemId, name) {
  const response = await trelloApi.put(
    `/cards/${cardId}/checkItem/${checkItemId}`,
    null,
    {
      params: {
        name,
      },
    },
  );

  return response.data;
}
