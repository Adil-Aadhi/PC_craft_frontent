import { createSlice } from "@reduxjs/toolkit";

const emptySelected = {
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  psu: null,
  storage: null,
  case: null,
  casefan: null,
  cooler: null,
};

const initialState = {
  selected: emptySelected,
  totalPrice: 0,
};

const selectedBuildSlice = createSlice({
  name: "build",
  initialState,
  reducers: {
    addComponent: (state, action) => {
      const { category, item } = action.payload;

      // remove old price if replacing
      if (state.selected[category]) {
        state.totalPrice -= Number(state.selected[category].price);
      }

      state.selected[category] = item;
      state.totalPrice += Number(item.price);
    },

    removeComponent: (state, action) => {
      const category = action.payload;

      if (state.selected[category]) {
        state.totalPrice -= Number(state.selected[category].price);
        state.selected[category] = null;
      }
    },

    clearBuild: () => initialState,
  },
});

export const { addComponent, removeComponent, clearBuild } =
  selectedBuildSlice.actions;

export default selectedBuildSlice.reducer;