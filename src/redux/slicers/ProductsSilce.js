import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
};

export const products = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setProducts } = products.actions;

export default products.reducer;
