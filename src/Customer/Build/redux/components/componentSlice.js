import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../api/axios"

// 🔹 category → endpoint map
const endpointMap = {
  cpu: "pc/cpu/",
  motherboard: "pc/motherboard/",
  ram: "pc/ram/",
  gpu: "pc/gpu/",
  psu: "pc/psu/",
  storage: "pc/storage/",
  case: "pc/case/",
  casefan: "pc/caseFan/",
  cooler: "pc/cooler/",
};

export const fetchComponents = createAsyncThunk(
  "components/fetchComponents",
  async (
    { category, search = "", price = "", page = 1 },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(`/products/${endpointMap[category]}`, {
        params: {
          search: search || undefined,
          price: price || undefined,
          page,
        },
      });

      return {
        category,
        data: res.data.results,   // DRF pagination
        next: res.data.next,
        page,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching data");
    }
  }
);

const componentSlice = createSlice({
  name: "components",
  initialState: {
  cpu: { items: [], next: null, page: 1, loading: false },
  motherboard: { items: [], next: null, page: 1, loading: false },
  ram: { items: [], next: null, page: 1, loading: false },
  gpu: { items: [], next: null, page: 1, loading: false },
  psu: { items: [], next: null, page: 1, loading: false },
  storage: { items: [], next: null, page: 1, loading: false },
  case: { items: [], next: null, page: 1, loading: false },
  casefan: { items: [], next: null, page: 1, loading: false },
  cooler: { items: [], next: null, page: 1, loading: false },
  error: null,
},
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 🔄 Loading
      .addCase(fetchComponents.pending, (state, action) => {
        const { category } = action.meta.arg;
        state[category].loading = true;
        state.error = null;
      })


      //  Success
      .addCase(fetchComponents.fulfilled, (state, action) => {
        const { category, data, next, page } = action.payload;

        if (page === 1) {
          // 🔁 New filter/search → replace
          state[category].items = data;
        } else {
          // ➕ Pagination → append
          state[category].items = [...state[category].items, ...data];
        }

        state[category].next = next;
        state[category].page = page;
        state[category].loading = false;
      })

      //  Error
      .addCase(fetchComponents.rejected, (state, action) => {
        const { category } = action.meta.arg || {};
        if (category && state[category]) {
          state[category].loading = false;
        }
        state.error = action.payload;
      });
  },
});

export default componentSlice.reducer;