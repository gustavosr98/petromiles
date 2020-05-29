import axios from "axios";
import errorRespondeHandler from "./error-response-handler";

const baseDomain = process.env.VUE_APP_PETROMILES_API;

const httpClient = axios.create({
  baseURL: baseDomain || "http://localhost:3000/api/v1",
  timeout: 6000,
});

httpClient.interceptors.response.use(
  response => response.data,
  errorRespondeHandler
);

export default httpClient;
