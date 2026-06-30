import { createPostCard } from "../PostCard/PostCard.js";
import "./Profile.css";

export function createProfile({ user, onToggleFavorite, onDeleteAccount }) {
  const container = document.createElement("div");
  container.className = "profile";

  const header = document.createElement("div");
  header.className = "profile__header";

  const avatar = document.createElement("img");
  avatar.className = "profile__avatar";
  avatar.src = user.image?.url || "";
  avatar.alt = user.name;

  const info = document.createElement("div");
  info.className = "profile__info";

  const name = document.createElement("h2");
  name.textContent = user.name;

  const email = document.createElement("p");
  email.className = "profile__email";
  email.textContent = user.email;

  const role = document.createElement("span");
  role.className = "profile__role";
  role.textContent = user.role;

  info.append(name, email, role);
  header.append(avatar, info);

  const favTitle = document.createElement("h3");
  favTitle.className = "profile__fav-title";
  favTitle.textContent = "Mis posts favoritos";

  const favGrid = document.createElement("div");
  favGrid.className = "profile__favorites";

  if (!user.posts || user.posts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "profile__empty";
    empty.textContent = "Todavía no has añadido ningún post a favoritos.";
    favGrid.appendChild(empty);
  } else {
    user.posts.forEach((post) => {
      const card = createPostCard({
        post,
        isFavorite: true,
        canFavorite: true,
        onToggleFavorite,
      });
      favGrid.appendChild(card);
    });
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "profile__delete-btn";
  deleteBtn.textContent = "Eliminar mi cuenta";
  deleteBtn.addEventListener("click", () => {
    if (confirm("¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      onDeleteAccount();
    }
  });

  container.append(header, favTitle, favGrid, deleteBtn);
  return container;
}
