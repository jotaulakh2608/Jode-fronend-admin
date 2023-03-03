import { configureStore } from '@reduxjs/toolkit';
import ProductReducer from './slicers/ProductsSilce';

export const store = configureStore({
  reducer: {
    products: ProductReducer,
  },
});
