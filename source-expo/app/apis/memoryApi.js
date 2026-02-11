import api from "./axiosClient";

export const listMemoryRequest = async (page, pageSize, searchTerm, categoryId, userId) => {
    const response = await api.get("Memory/Paginate", {
      params: {
        PageNumber: page,
        PageSize: pageSize,
        FilterText: searchTerm ? searchTerm : '',
        CategoryId: categoryId ? categoryId : '',
        UserId: userId ? userId : ''
      },
    });

    return response.data;
};

export const getMemoryRequest = async (memoryId) => {
  const response = await api.get(`Memory/${memoryId}`);

  return response.data;
};

export const editRequest = async (id, userId, birthDate, deathDate, isPrivate, isLinkOnly, isOpenToComment, categoryId, name, text) => {
  let data = {
    id: id,
    userId: userId,
    birthDate: birthDate,
    deathDate: deathDate,
    isPrivate: isPrivate,
    isLinkOnly: isLinkOnly,
    isOpenToComment: isOpenToComment,
    categoryId: categoryId,
    name: name,
    text: text,
    isDeleted: false
  }

  const response = await api.post(`Memory/Update`, data);

  return response.data;
};

export const saveRequest = async (id, userId, birthDate, deathDate, isPrivate, isLinkOnly, isOpenToComment, categoryId, name, text) => {
  let data = {
    id: id,
    userId: userId,
    birthDate: birthDate,
    deathDate: deathDate,
    isPrivate: isPrivate,
    isLinkOnly: isLinkOnly,
    isOpenToComment: isOpenToComment,
    categoryId: categoryId,
    name: name,
    text: text,
    isDeleted: false
  }

  const response = await api.post(`Memory/Save`, data);

  return response.data;
};

export const commentAllRequest = async (memoryId) => {
  const response = await api.get(`Memory/CommentAll/${memoryId}`);
  return response.data;
};

export const addCommentRequest = async (id, memoryId, userId, comment, nameSurname, isApproved) => {
  const response = await api.post(`Memory/AddComment`, {
    id: id,
    memoryId: memoryId,
    comment: comment,
    userId: userId,
    nameSurname: nameSurname,
    isApproved: isApproved
  });

  return response.data;
};

export const approveCommentRequest = async (commentId) => {
  const response = await api.get(`Memory/ApproveComment/${commentId}`);

  return response.data;
};

export const deleteCommentRequest = async (commentId) => {
  const response = await api.get(`Memory/DeleteComment/${commentId}`);

  return response.data;
};

export const dislikeRequest = async (memoryId, userId) => {
  const response = await api.get(`Memory/Dislike/${memoryId}/${userId}`);

  return response.data;
};

export const likeRequest = async (id, memoryId, userId) => {
  const response = await api.post(`Memory/Like`, {
    id: id,
    memoryId: memoryId,
    userId: userId
  });

  return response.data;
};

export const addYoutubeLinkRequest = async (id, memoryId, youtubeLink) => {
  const response = await api.post(`Memory/MemoryYoutubeLinkAdd`, {
    id: id,
    memoryId: memoryId,
    link: youtubeLink,
    isDeleted: false
  });

  return response.data;
};

export const youtubelinkDeleteRequest = async (id) => {
  const response = await api.delete(`Memory/MemoryYoutubeLinkDelete/${id}`);

  return response.data;
};

export const memoryFileAddRequest = async (data) => {
  const response = await api.post('Memory/MemoryFileAdd', data);

  return response.data;
}

export const memoryFileDeleteRequest = async (id) => {
  const response = await api.delete(`Memory/MemoryFileDelete/${id}`);

  return response.data;
};

export const setMemoryFileIsPrimaryRequest = async (id) => {
  const response = await api.get(`Memory/SetMemoryFileIsPrimary/${id}`);

  return response.data;
}

export const getMemoryCountRequest = async (id) => {
  const response = await api.get(`Memory/GetMemoryCount/${id}`);

  return response.data;
}

export const lightCandleRequest = async (data) => {
  const response = await api.post(`Memory/LightCandle`, data);

  return response.data;
};

export const updateCandleRequest = async (data) => {
  const response = await api.post(`Memory/UpdateCandle`, data);

  return response.data;
};

