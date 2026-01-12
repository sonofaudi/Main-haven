// Decide API base URL (dev vs production)
const API =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "";

/* ---------- token helpers ---------- */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearToken = () => {
  localStorage.removeItem("token");
};

/* ---------- fetch helpers ---------- */
export async function post(url, data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
}


export const authedGet = async (url) => {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(API + url, {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Auth request failed");
  }

  return res.json();
};

/* ---------- page helpers ---------- */
export const getStartedRedirect = () => {
  const token = getToken();
  window.location.href = token ? "profile.html" : "sign-up.html";
};
