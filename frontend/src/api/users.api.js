const API_URL = import.meta.env.VITE_API_URL;

export async function getProfile(token) {
  const res = await fetch(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener el perfil");
  return data;
}

export async function addFavoritePost(userId, postId, token) {
  const res = await fetch(`${API_URL}/users/${userId}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al añadir favorito");
  return data;
}

export async function removeFavoritePost(userId, postId, token) {
  const res = await fetch(`${API_URL}/users/${userId}/posts/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al quitar favorito");
  return data;
}

export async function getAllUsers(token) {
  const res = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener usuarios");
  return data;
}

export async function changeUserRole(userId, role, token) {
  const res = await fetch(`${API_URL}/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al cambiar rol");
  return data;
}

export async function deleteAccount(userId, token) {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al eliminar la cuenta");
  return data;
}
