import "./AdminPanel.css";

export function createAdminPanel({ users, currentUserId, onChangeRole, onDeleteUser }) {
  const container = document.createElement("div");
  container.className = "admin-panel";

  const header = document.createElement("div");
  header.className = "admin-panel__header";

  const title = document.createElement("h2");
  title.textContent = "Panel de administración";

  const count = document.createElement("span");
  count.className = "admin-panel__count";
  count.textContent = `${users.length} usuario${users.length !== 1 ? "s" : ""}`;

  header.append(title, count);

  const table = document.createElement("div");
  table.className = "admin-panel__table";

  users.forEach((user) => {
    const isSelf = user._id === currentUserId;

    const row = document.createElement("div");
    row.className = `admin-panel__row${isSelf ? " is-self" : ""}`;

    const avatar = document.createElement("img");
    avatar.className = "admin-panel__avatar";
    avatar.src = user.image?.url || "";
    avatar.alt = user.name;

    const info = document.createElement("div");
    info.className = "admin-panel__info";

    const name = document.createElement("span");
    name.className = "admin-panel__name";
    name.textContent = user.name + (isSelf ? " (tú)" : "");

    const email = document.createElement("span");
    email.className = "admin-panel__email";
    email.textContent = user.email;

    info.append(name, email);

    const roleBadge = document.createElement("span");
    roleBadge.className = `admin-panel__role admin-panel__role--${user.role}`;
    roleBadge.textContent = user.role;

    const actions = document.createElement("div");
    actions.className = "admin-panel__actions";

    const roleBtn = document.createElement("button");
    roleBtn.className = "admin-panel__btn admin-panel__btn--role";
    roleBtn.textContent = user.role === "admin" ? "Hacer user" : "Hacer admin";
    roleBtn.disabled = isSelf;
    roleBtn.title = isSelf ? "No puedes cambiar tu propio rol" : "";
    roleBtn.addEventListener("click", async () => {
      roleBtn.disabled = true;
      await onChangeRole(user._id, user.role === "admin" ? "user" : "admin");
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "admin-panel__btn admin-panel__btn--delete";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.disabled = isSelf;
    deleteBtn.title = isSelf ? "Usa tu perfil para eliminar tu propia cuenta" : "";
    deleteBtn.addEventListener("click", async () => {
      if (confirm(`¿Eliminar la cuenta de "${user.name}"? Esta acción no se puede deshacer.`)) {
        deleteBtn.disabled = true;
        await onDeleteUser(user._id);
      }
    });

    actions.append(roleBtn, deleteBtn);
    row.append(avatar, info, roleBadge, actions);
    table.appendChild(row);
  });

  container.append(header, table);
  return container;
}
