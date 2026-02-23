export const selectSelected = (state) => state.build.selected;

export const selectTotalPrice = (state) => state.build.totalPrice;

export const selectSelectedByCategory = (category) => (state) =>
  state.build.selected[category];