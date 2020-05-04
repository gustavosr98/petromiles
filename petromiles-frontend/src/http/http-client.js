import axios from "axios";

const baseDomain = process.env.VUE_APP_PETROMILES_API;

const httpClient = axios.create({
  baseURL: baseDomain || "http://localhost:3000",
  timeout: 6000,
});

httpClient.interceptors.response.use(response => response.data);

export default httpClient;
