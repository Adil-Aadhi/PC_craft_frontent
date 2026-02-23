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

// 🔥 Async thunk → fetch components by type
export const fetchComponents = createAsyncThunk(
  "components/fetchComponents",
  async (category, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${endpointMap[category]}`);
      return { category, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching data");
    }
  }
);

const componentSlice = createSlice({
  name: "components",
  initialState: {
    cpu: [],
    motherboard: [],
    ram: [],
    gpu: [],
    psu: [],
    storage: [],
    case: [],
    casefan: [],
    cooler: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 🔄 Loading
      .addCase(fetchComponents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ✅ Success
      .addCase(fetchComponents.fulfilled, (state, action) => {
        const { category, data } = action.payload;
        state[category] = data;
        state.loading = false;
      })

      // ❌ Error
      .addCase(fetchComponents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default componentSlice.reducer;