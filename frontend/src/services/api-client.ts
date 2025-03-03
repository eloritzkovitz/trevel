import axios, { CanceledError } from "axios";

export { CanceledError };

const backend_url = import.meta.env.PORT
const apiClient = axios.create({
    baseURL: backend_url,
});

export default apiClient;