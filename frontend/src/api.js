// src/api.js
const BASE_URL = "https://hacthon-stackhack.onrender.com";

async function request(endpoint, { method = "GET", body, token } = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || response.statusText);
  return data;
}

export const api = {
  // ✅ Auth
  facultyLogin: (body) => request("/faculty/login", { method: "POST", body }),

  // ✅ Events
  getEvents: (token) => request("/events", { method: "GET", token }),
  getEvent: (id, token) => request(`/events/${id}`, { method: "GET", token }),
  createEvent: (body, token) => request("/events/add", { method: "POST", body, token }),
  updateEventDateTime: (id, body, token) =>
    request(`/events/update-datetime/${id}`, { method: "PUT", body, token }),

  // ✅ Faculty add results
  addResults: (eventId, body, token) =>
    request(`/events/${eventId}/results`, { method: "POST", body, token }),

  // ✅ Export CSV
  exportRegistrations: async (eventId, token) => {
    const url = `${BASE_URL}/events/${eventId}/registrations/export`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Export failed: ${res.statusText}`);
    }

    return await res.blob();
  },

  getRegistrations: (eventId, token) =>
    request(`/events/${eventId}/registrations`, { method: "GET", token }),
};
