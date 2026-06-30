import { userIcon, logoutIcon } from "../../utils/icons.js";
import "./Header.css";

export function createHeader({ user, onNavigate, onLogout }) {
  const header = document.createElement("header");
  header.className = "header";

  const logo = document.createElement("h1");
  logo.className = "header__logo";
  logo.textContent = "BackendMBA";
  logo.addEventListener("click", () => onNavigate("posts"));

  const nav = document.createElement("nav");
  nav.className = "header__nav";

  const postsBtn = document.createElement("button");
  postsBtn.className = "header__nav-btn";
  postsBtn.textContent = "Posts";
  postsBtn.addEventListener("click", () => onNavigate("posts"));
  nav.appendChild(postsBtn);

  if (user) {
    if (user.role === "admin") {
      const adminBtn = document.createElement("button");
      adminBtn.className = "header__nav-btn header__admin-btn";
      adminBtn.textContent = "⚙ Admin";
      adminBtn.addEventListener("click", () => onNavigate("admin"));
      nav.appendChild(adminBtn);
    }

    const profileBtn = document.createElement("button");
    profileBtn.className = "header__nav-btn header__profile-btn";
    profileBtn.innerHTML = `${userIcon()}<span>${user.name}</span>`;
    profileBtn.addEventListener("click", () => onNavigate("profile"));

    const logoutBtn = document.createElement("button");
    logoutBtn.className = "header__nav-btn header__logout-btn";
    logoutBtn.innerHTML = `${logoutIcon()}<span>Salir</span>`;
    logoutBtn.addEventListener("click", onLogout);

    nav.append(profileBtn, logoutBtn);
  } else {
    const loginBtn = document.createElement("button");
    loginBtn.className = "header__nav-btn";
    loginBtn.textContent = "Iniciar sesión";
    loginBtn.addEventListener("click", () => onNavigate("login"));
    nav.appendChild(loginBtn);
  }

  header.append(logo, nav);
  return header;
}
