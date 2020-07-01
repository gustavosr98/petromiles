import axios from "axios";
import errorRespondeHandler from "./error-response-handler";

const baseDomain = process.env.VUE_APP_PETROMILES_API_URL;

const httpClient = axios.create({
  baseURL: baseDomain || "http://localhost:3000/api/v1",
  crossDomain: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: parseInt(process.env.VUE_APP_PETROMILES_API_TIMEOUT) || 30000,
});

httpClient.interceptors.response.use(
  response => response.data,
  errorRespondeHandler
);

export default httpClient;
