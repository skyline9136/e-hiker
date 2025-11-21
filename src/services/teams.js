const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:3001";

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return await res.json().catch(() => null);
}

export async function createTeam(team) {
  return await http("POST", "/teams", team);
}

export async function getTeams(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const path = qs ? `/teams?${qs}` : "/teams";
  return await http("GET", path);
}

export async function updateTeam(id, partial) {
  return await http("PATCH", `/teams/${id}`, partial);
}

export async function deleteTeam(id) {
  return await http("DELETE", `/teams/${id}`);
}


