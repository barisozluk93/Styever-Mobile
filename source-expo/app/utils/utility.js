export const isNullOrEmpty = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '');

export const appUrl = "https://styever.com";
export const articleUploadFolderUrl = "https://styever.com/Uploads/Articles/";
export const memoryUploadFolderUrl = "https://styever.com/Uploads/Memories/";
export const avatarUploadFolderUrl = "https://styever.com/Uploads/Avatars/";