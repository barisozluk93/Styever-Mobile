import api from "./axiosClient";

export const listFaqRequest = async () => {
  const response = await api.get("FAQ/GetAll");

  return response.data;
};

export const getArticleRequest = async (articleId) => {
  const response = await api.get(`Article/${articleId}`);

  return response.data;
};



