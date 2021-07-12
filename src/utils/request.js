import axios from "axios";

/**
 * Create axios instance for using default baseURL,
 * so when we want to use difference host.
 * Just use default axios.
 */
export const request = axios.create({
  baseURL: process.env.VUE_APP_API_HOST
});
