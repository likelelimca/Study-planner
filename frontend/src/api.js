const BASE_URL = "http://localhost:5000/api";

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
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
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
