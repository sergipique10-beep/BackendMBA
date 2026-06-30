import { heartIcon } from "../../utils/icons.js";
import "./PostCard.css";

export function createPostCard({ post, isFavorite, canFavorite, onToggleFavorite }) {
  const card = document.createElement("article");
  card.className = "post-card";

  const category = document.createElement("span");
  category.className = "post-card__category";
  category.textContent = post.category;

  const title = document.createElement("h3");
  title.className = "post-card__title";
  title.textContent = post.title;

  const description = document.createElement("p");
  description.className = "post-card__description";
  description.textContent = post.description;

  const author = document.createElement("span");
  author.className = "post-card__author";
  author.textContent = `Por ${post.author}`;

  card.append(category, title, description, author);

  if (canFavorite) {
    const favBtn = document.createElement("button");
    favBtn.className = `post-card__fav-btn${isFavorite ? " is-active" : ""}`;
    favBtn.innerHTML = heartIcon(isFavorite);
    favBtn.setAttribute("aria-label", isFavorite ? "Quitar de favoritos" : "Añadir a favoritos");
    favBtn.addEventListener("click", () => onToggleFavorite(post._id, isFavorite));
    card.appendChild(favBtn);
  }

  return card;
}
