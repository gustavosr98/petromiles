import axios from "axios";
import errorRespondeHandler from "./error-response-handler";

const baseDomain = process.env.VUE_APP_PETROMILES_API_URL;
const suffix = "api/v1";
const port = process.env.VUE_APP_PETROMILES_API_PORT;

const httpClient = axios.create({
  baseURL:
    (!!baseDomain && `http://${baseDomain}:${port}/${suffix}`) ||
    "http://localhost:3000/api/v1",
  timeout: process.env.VUE_APP_PETROMILES_API_TIMEOUT || 30000,
});

httpClient.interceptors.response.use(
  response => response.data,
  errorRespondeHandler
);

export default httpClient;
