export const isNullOrEmpty = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '');

export const articleUploadFolderUrl = "http://178.251.42.243/Uploads/Articles/";
export const memoryUploadFolderUrl = "http://178.251.42.243/Uploads/Memories/";
export const avatarUploadFolderUrl = "http://178.251.42.243/Uploads/Avatars/";