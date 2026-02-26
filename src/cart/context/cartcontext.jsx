import { createContext, useContext, useReducer } from "react";
import api from "../../api/axios";

const CartContext = createContext();

const initialState = {
  items: [],
  total_builds: 0,
  cart_total_price: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "ADD_BUILD":
      return {
        ...state,
        items: [...state.items, action.payload],
        total_builds: state.total_builds + 1,
        cart_total_price: state.cart_total_price + action.payload.total_price,
      };

    case "UPDATE_BUILD":
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      return {
        ...state,
        items: updatedItems,
        cart_total_price: updatedItems.reduce(
          (sum, item) => sum + item.total_price,
          0
        ),
      };

    case "DELETE_BUILD":
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload
      );

      return {
        ...state,
        items: filteredItems,
        total_builds: filteredItems.length,
        cart_total_price: filteredItems.reduce(
          (sum, item) => sum + item.total_price,
          0
        ),
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // 🔹 GET CART
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/items/");
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (err) {
      console.error("Fetch cart error", err);
    }
  };

  // 🔹 ADD BUILD
  const addBuild = async (buildData) => {
    try {
      const res = await api.post("/cart/items/", buildData);
      dispatch({ type: "ADD_BUILD", payload: res.data.item });
    } catch (err) {
      console.error("Add build error", err);
    }
  };

  // 🔹 UPDATE BUILD
  const updateBuild = async (id, updatedData) => {
    try {
      const res = await api.patch(`/cart/items/${id}/`, updatedData);
      dispatch({ type: "UPDATE_BUILD", payload: res.data.item });
    } catch (err) {
      console.error("Update build error", err);
    }
  };

  // 🔹 DELETE BUILD
  const deleteBuild = async (id) => {
    try {
      await api.delete(`/cart/items/${id}/`);
      dispatch({ type: "DELETE_BUILD", payload: id });
    } catch (err) {
      console.error("Delete build error", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addBuild,
        updateBuild,
        deleteBuild,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);