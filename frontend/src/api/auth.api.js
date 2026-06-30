const API_URL = import.meta.env.VITE_API_URL;

export async function registerUser(formData) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al registrar usuario");
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");
  return data;
}
