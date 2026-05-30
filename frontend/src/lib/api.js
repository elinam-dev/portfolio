import axios from "axios";

// In production (Vercel): same-origin serverless functions at /api/*
// In Emergent dev: ingress maps /api/* to FastAPI on port 8001 (legacy)
// REACT_APP_BACKEND_URL is honored only if set, otherwise relative paths.
const BASE = process.env.REACT_APP_API_BASE || "";

export const api = axios.create({ baseURL: BASE, timeout: 60000 });

export const postChat = (payload) => api.post("/api/chat", payload).then((r) => r.data);
export const polishText = (text) => api.post("/api/polish", { text }).then((r) => r.data);
export const summarizeProject = (p) => api.post("/api/summarize", p).then((r) => r.data);
