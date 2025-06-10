import axios from "axios";

const axiosServices = axios.create({
  baseURL: `https://casino.truebliss.dev/api`,
});
export default axiosServices;
