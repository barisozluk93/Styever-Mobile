import { listMemoryRequest } from "@/apis/memoryApi";


export const listMemory = (page, pageSize, searchTerm, categoryId) => async (dispatch) => {
  try {
    dispatch({ type: 'MEMORY_LIST_REQUEST' });
    const data = await listMemoryRequest(page, pageSize, searchTerm, categoryId);
    data.data.page = page;
    data.data.pageSize = pageSize;
    dispatch({ type: 'MEMORY_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'MEMORY_LIST_FAIL', payload: error.response?.data?.message || error.message });
  }
};