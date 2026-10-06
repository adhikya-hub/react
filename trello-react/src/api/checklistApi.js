import trelloApi from "./trello";

export async function getCardChecklists(cardId) {
  const response = await trelloApi.get(`/cards/${cardId}/checklists`);

  return response.data;
}

export async function createChecklist(cardId, name) {
  const response = await trelloApi.post(`/cards/${cardId}/checklists`, null, {
    params: {
      name,
    },
  });

  return response.data;
}

export async function renameChecklist(checklistId, name) {
  const response = await trelloApi.put(`/checklists/${checklistId}`, null, {
    params: {
      name,
    },
  });

  return response.data;
}

export async function deleteChecklist(checklistId) {
  await trelloApi.delete(`/checklists/${checklistId}`);
}
