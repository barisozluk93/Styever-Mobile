import api from "./axiosClient";

export const registerDevice = async (data) => {
    const response = await api.post("/Notification/RegisterDevice", data);

    return response?.data;
};

export const allNotifications = async (userId) => {
    const response = await api.get("/Notification/All/" + userId );

    return response?.data;
};

export const markNotificationAsRead = async (id) => {
    const response = await api.get("/Notification/Read/" + id );

    return response?.data;
};

export const deleteNotification = async (id) => {
    const response = await api.delete("/Notification/Delete/" + id );

    return response?.data;
};

export const unReadCount = async (userId) => {
    const response = await api.get("/Notification/UnreadCount/" + userId);

    return response?.data;
};