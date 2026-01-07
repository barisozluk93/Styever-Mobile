import api from "./axiosClient";

export const listArticleRequest = async (searchTerm, language) => {
  const response = await api.get("Article/GetAll", {
    params: {
      FilterText: searchTerm ? searchTerm : '',
      Language: language ? language : ''
    },
  });

  return response.data;
};

export const getArticleRequest = async (articleId) => {
  const response = await api.get(`Article/${articleId}`);

  return response.data;
};



