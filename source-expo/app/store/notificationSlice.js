import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount++;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
});

export const { addNotification, setUnreadCount } = slice.actions;
export default slice.reducer;