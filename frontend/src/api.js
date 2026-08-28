// Falls back to localhost for local development. When deployed, set
// VITE_API_URL as an environment variable on your hosting platform
// (e.g. Vercel/Netlify) pointing at your live Render backend.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = token;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  verifyOtp: (body) => request("/auth/verify-otp", { method: "POST", body: JSON.stringify(body) }),
  resendOtp: (body) => request("/auth/resend-otp", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: (body) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify(body) }),
  resetPassword: (body) => request("/auth/reset-password", { method: "POST", body: JSON.stringify(body) }),
  getProfile: () => request("/auth/profile"),

  getSubjects: () => request("/subjects"),
  createSubject: (body) => request("/subjects", { method: "POST", body: JSON.stringify(body) }),
  updateSubject: (id, body) => request(`/subjects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteSubject: (id) => request(`/subjects/${id}`, { method: "DELETE" }),

  getTasks: (params = "") => request(`/tasks${params}`),
  createTask: (body) => request("/tasks", { method: "POST", body: JSON.stringify(body) }),
  updateTask: (id, body) => request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),

  getSchedules: () => request("/schedules"),
  createSchedule: (body) => request("/schedules", { method: "POST", body: JSON.stringify(body) }),
  updateSchedule: (id, body) => request(`/schedules/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteSchedule: (id) => request(`/schedules/${id}`, { method: "DELETE" }),

  getDashboard: () => request("/dashboard"),
};

export function saveSession(token, fullName) {
  localStorage.setItem("token", token);
  localStorage.setItem("fullName", fullName);
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("fullName");
}

export function isLoggedIn() {
  return !!getToken();
}
