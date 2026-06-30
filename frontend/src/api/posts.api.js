const API_URL = import.meta.env.VITE_API_URL;

export async function getPosts({ category = "", page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (category) params.set("category", category);

  const res = await fetch(`${API_URL}/posts?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener posts");
  return data;
}

export async function getPostById(id) {
  const res = await fetch(`${API_URL}/posts/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener el post");
  return data;
}
