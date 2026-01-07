import { listArticleRequest } from "@/apis/articleApi";


export const listArticle = (searchTerm, language) => async (dispatch) => {
  try {
    dispatch({ type: 'ARTICLE_LIST_REQUEST' });
    const data = await listArticleRequest(searchTerm, language);
    dispatch({ type: 'ARTICLE_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'ARTICLE_LIST_FAIL', payload: error.response?.data?.message || error.message });
  }
};