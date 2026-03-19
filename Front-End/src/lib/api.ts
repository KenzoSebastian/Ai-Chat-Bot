// src/lib/api.ts (Frontend)
import { hc } from "hono/client";
import type { AppType } from "../../../Back-End/src/index";

// Gunakan Environment Variable agar otomatis ganti saat online
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = hc<AppType>(API_URL);
