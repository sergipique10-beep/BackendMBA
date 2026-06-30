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

export async function deleteAccount(userId, token) {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al eliminar la cuenta");
  return data;
}
