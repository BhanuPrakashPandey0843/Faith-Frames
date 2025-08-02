// Pixar/api/index.js
import axios from "axios";

// ✅ Use local IP address of the backend server (works on physical devices)
const BASE_URL = "http://192.168.0.110:5000/api"; // Don't use localhost for real devices

export const apiCall = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/wallpapers`, { params });
    return { success: true, data: response.data };
  } catch (error) {
    console.log("got error: ", error.message);
    return { success: false, msg: error.message };
  }
};
