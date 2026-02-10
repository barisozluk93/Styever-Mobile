import api from "./axiosClient";

export const saveRequest = async (id, fullname, subject, message, email) => {
  let data = {
    id: id,
    fullname: fullname,
    email: email,
    subject: subject,
    message: message,
    isDeleted: false
  }

  const response = await api.post(`ContactUs/Save`, data);

  return response.data;
};



