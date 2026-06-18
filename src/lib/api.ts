const BASE_URL = "http://localhost:3000";

// Helper fetch dengan token
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  return fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

// ── AUTH ──────────────────────────────────────────
export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const logout = async () => {
  const res = await fetchWithAuth("/api/auth/logout", { method: "POST" });
  return res.json();
};

// ── SKILLS ────────────────────────────────────────
export const getSkills = async () => {
  const res = await fetch(`${BASE_URL}/api/skills`);
  return res.json();
};

export const createSkill = async (data: object) => {
  const res = await fetchWithAuth("/api/skills", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateSkill = async (id: string, data: object) => {
  const res = await fetchWithAuth(`/api/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteSkill = async (id: string) => {
  const res = await fetchWithAuth(`/api/skills/${id}`, { method: "DELETE" });
  return res.json();
};

// ── PORTFOLIOS ────────────────────────────────────
export const getPortfolios = async () => {
  const res = await fetch(`${BASE_URL}/api/portfolios`);
  return res.json();
};

export const createPortfolio = async (data: object) => {
  const res = await fetchWithAuth("/api/portfolios", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updatePortfolio = async (id: string, data: object) => {
  const res = await fetchWithAuth(`/api/portfolios/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deletePortfolio = async (id: string) => {
  const res = await fetchWithAuth(`/api/portfolios/${id}`, { method: "DELETE" });
  return res.json();
};

// ── CONTACT ───────────────────────────────────────
export const sendContact = async (data: object) => {
  const res = await fetch(`${BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};