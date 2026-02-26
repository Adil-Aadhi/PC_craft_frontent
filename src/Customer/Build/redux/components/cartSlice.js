import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../api/axios";

/* ================================
   🔹 ADD BUILD
================================ */
export const addBuildToCart = createAsyncThunk(
  "cart/addBuildToCart",
  async (buildData, { rejectWithValue }) => {
    try {
      const res = await api.post("/cart/items/", buildData);
      return res.data.item;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Add build failed");
    }
  }
);

/* ================================
   🔹 FETCH SINGLE CART ITEM (EDIT MODE)
================================ */
export const fetchCartItemById = createAsyncThunk(
  "cart/fetchCartItemById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/cart/items/${id}/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch build failed");
    }
  }
);

/* ================================
   🔹 UPDATE BUILD (PATCH)
================================ */
export const updateBuild = createAsyncThunk(
  "cart/updateBuild",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/cart/items/${id}/`, data);
      return res.data.item;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update build failed");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total_builds: 0,
    cart_total_price: 0,
    loading: false,
    error: null,

    editingBuild: null,   // 🔥 for builder prefill
  },

  reducers: {
    clearEditingBuild: (state) => {
      state.editingBuild = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* 🔹 ADD BUILD */
      .addCase(addBuildToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBuildToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.total_builds += 1;
        state.cart_total_price += action.payload.total_price;
      })
      .addCase(addBuildToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* 🔹 FETCH SINGLE BUILD */
      .addCase(fetchCartItemById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.editingBuild = action.payload;
      })
      .addCase(fetchCartItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* 🔹 UPDATE BUILD */
      .addCase(updateBuild.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBuild.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload;

        // replace in cart list
        state.items = state.items.map((item) =>
          item.id === updated.id ? updated : item
        );

        // recalc total price
        state.cart_total_price = state.items.reduce(
          (sum, item) => sum + item.total_price,
          0
        );

        state.editingBuild = null; // exit edit mode
      })
      .addCase(updateBuild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEditingBuild } = cartSlice.actions;

export default cartSlice.reducer;