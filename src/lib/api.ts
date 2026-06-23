const BASE_URL = "https://backend-portofolio-production-cd5b.up.railway.app";

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
export const register = async (email: string, password: string, name?: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  return res.json();
};

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
  try {
    return await res.json();
  } catch {
    return { success: false, message: `Delete failed with status ${res.status}` };
  }
};

// ── PORTFOLIOS ────────────────────────────────────
export type ProjectWorkType = "Individu" | "Tim"

export const getPortfolios = async (_projectId: any) => {
  const res = await fetch(`${BASE_URL}/api/portofolio`);
  return res.json();
};

export const getPortfolioById = async (id: string) => {
  const isUuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
  if (!isUuidV4) {
    return { success: false, message: 'ID portofolio tidak valid.', status: 400, data: null }
  }

  const res = await fetch(`${BASE_URL}/api/portofolio/${id}`);


  // Hindari exception ketika response bukan JSON (atau bukan 2xx)
  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    return {
      success: false,
      message: payload?.message ?? `Request failed with status ${res.status}`,
      status: res.status,
      data: payload?.data ?? null,
    };
  }

  return payload;
}


export const createPortfolio = async (data: object) => {
  const res = await fetchWithAuth("/api/portofolio", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updatePortfolio = async (id: string, data: object) => {
  const res = await fetchWithAuth(`/api/portofolio/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deletePortfolio = async (id: string) => {
  const res = await fetchWithAuth(`/api/portofolio/${id}`, { method: "DELETE" });

  // Supaya error 404 tidak “silent”, tampilkan response body jika ada
  try {
    return await res.json();
  } catch {
    return { success: false, message: `Delete failed with status ${res.status}` };
  }
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