import axios from 'axios';
import { port } from '../constants/const';

export const createProduct = async (data) => {
  try {
    return await axios.post(`${port}/products/create`, data, {
      'Content-Type': 'multipart/form-data',
    });
  } catch (error) {
    return error;
  }
};

export const getAllProducts = async () => {
  try {
    return await axios.get(`${port}/products/all`);
  } catch (error) {
    return error;
  }
};
export const getOneProduct = async (id) => {
  try {
    return await axios.get(`${port}/products/${id}`);
  } catch (error) {
    return error;
  }
};

export const deleteProduct = async (id) => {
  try {
    return await axios.delete(`${port}/products/${id}`);
  } catch (error) {
    return error;
  }
};
