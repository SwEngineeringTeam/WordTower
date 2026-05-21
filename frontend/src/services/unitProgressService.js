import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const getUnitProgress = async (userId, unitId) => {
  const res = await axios.get(`${BASE_URL}/api/progress/${userId}/unit/${unitId}`);
  return res.data;
};

export const markUnitAsDone = async (userId, unitId, type) => {
  const res = await axios.post(
    `${BASE_URL}/api/progress/${userId}/unit/${unitId}/done`,
    { type }
  );
  return res.data;
};