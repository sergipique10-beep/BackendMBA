import { createPostCard } from "../PostCard/PostCard.js";
import "./PostList.css";

const CATEGORIES = ["", "tecnología", "ciencia", "cultura", "deportes", "política", "otros"];

export function createPostList({ posts, favoriteIds, canFavorite, onToggleFavorite, onFilterCategory, currentCategory }) {
  const container = document.createElement("div");
  container.className = "post-list";

  const filters = document.createElement("div");
  filters.className = "post-list__filters";

  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = `post-list__filter-btn${currentCategory === cat ? " is-active" : ""}`;
    btn.textContent = cat || "Todas";
    btn.addEventListener("click", () => onFilterCategory(cat));
    filters.appendChild(btn);
  });

  const grid = document.createElement("div");
  grid.className = "post-list__grid";

  if (posts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "post-list__empty";
    empty.textContent = "No hay posts en esta categoría.";
    grid.appendChild(empty);
  } else {
    posts.forEach((post) => {
      const card = createPostCard({
        post,
        isFavorite: favoriteIds.includes(post._id),
        canFavorite,
        onToggleFavorite,
      });
      grid.appendChild(card);
    });
  }

  container.append(filters, grid);
  return container;
}
