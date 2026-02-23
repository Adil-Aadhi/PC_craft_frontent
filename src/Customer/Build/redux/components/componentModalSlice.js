import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  category: null,
  componentId: null,
};

const componentModalSlice = createSlice({
  name: "componentModal",
  initialState,
  reducers: {
    openComponentModal: (state, action) => {
      state.isOpen = true;
      state.category = action.payload.category;
      state.componentId = action.payload.componentId;
    },
    closeComponentModal: (state) => {
      state.isOpen = false;
      state.category = null;
      state.componentId = null;
    },
  },
});

export const { openComponentModal, closeComponentModal } =
  componentModalSlice.actions;

export default componentModalSlice.reducer;