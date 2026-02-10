const initialState = {
  memories: null,
  categoryId: null,
  searchTerm: null,
  isMyList: null,
  page: null,
  pageSize: null,
  totalPages: null,
  totalCounts: null,
  loading: false,
  error: null,
};


export default function MemoryReducer(state = initialState, action) {
  switch (action.type) {

    case 'MEMORY_LIST_REQUEST':
      return { ...state, loading: true, error: null };


    case 'MEMORY_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        memories: action.payload.data.items,
        page: action.payload.data.page,
        pageSize: action.payload.data.pageSize,
        totalCounts: action.payload.data.totalCount,
        totalPages: action.payload.data.totalPages,
      };

    case 'MEMORY_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };
    
    case 'MEMORY_SET_FILTER':
      return {
        ...state,
        searchTerm: action.payload.searchTerm,
        categoryId: action.payload.categoryId,
        isMyList: action.payload.isMyList
      };

    case 'MEMORY_INIT':
      return initialState;

    default:
      return state;
  }
}