const initialState = {
  articles: null,
  searchTerm: null,
  loading: false,
  error: null,
};


export default function ArticleReducer(state = initialState, action) {
  switch (action.type) {

    case 'ARTICLE_LIST_REQUEST':
      return { ...state, loading: true, error: null };


    case 'ARTICLE_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        articles: action.payload.data,
      };

    case 'ARTICLE_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };
    
    case 'ARTICLE_SET_FILTER':
      return {
        ...state,
        searchTerm: action.payload.searchTerm,
      };

    case 'ARTICLE_INIT':
      return initialState;

    default:
      return state;
  }
}