import { configureStore } from "@reduxjs/toolkit";
import componentReducer from "../redux/components/componentSlice"
import buildReducer from "../redux/components/selectedBuildSlice"
import componentModalReducer from "../redux/components/componentModalSlice"
import cartReducer from "../redux/components/cartSlice"
import orderReducer from "../redux/components/orders/orderslice"

export const store = configureStore({
  reducer: {
    components: componentReducer,
    build: buildReducer,
    componentModal: componentModalReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});