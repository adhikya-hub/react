import axios from "axios";

const trelloApi = axios.create({
  baseURL: "https://api.trello.com/1",
  params: {
    key: import.meta.env.VITE_TRELLO_API_KEY,
    token: import.meta.env.VITE_TRELLO_TOKEN,
  },
});

export default trelloApi;
