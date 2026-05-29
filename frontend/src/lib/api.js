import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, timeout: 60000 });

export const getCV = () => api.get("/cv").then((r) => r.data);
export const postChat = (payload) => api.post("/chat", payload).then((r) => r.data);
export const polishText = (text) => api.post("/polish", { text }).then((r) => r.data);
export const summarizeProject = (p) => api.post("/summarize", p).then((r) => r.data);
export const sendContact = (payload) => api.post("/contact", payload).then((r) => r.data);
