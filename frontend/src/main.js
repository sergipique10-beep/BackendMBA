import "./style.css";
import { createHeader } from "./components/Header/Header.js";
import { createAuthForm } from "./components/AuthForm/AuthForm.js";
import { createPostList } from "./components/PostList/PostList.js";
import { createProfile } from "./components/Profile/Profile.js";
import { loginUser, registerUser } from "./api/auth.api.js";
import { getProfile, addFavoritePost, removeFavoritePost, deleteAccount } from "./api/users.api.js";
import { getPosts } from "./api/posts.api.js";
import { getToken, setToken, clearToken } from "./utils/storage.js";

const state = {
  token: getToken(),
  user: null,
  posts: [],
  view: "posts", // 'posts' | 'login' | 'profile'
  category: "",
};

const app = document.querySelector("#app");

async function init() {
  if (state.token) {
    try {
      state.user = await getProfile(state.token);
    } catch {
      clearToken();
      state.token = null;
    }
  }
  await loadPosts();
  render();
}

async function loadPosts() {
  try {
    const data = await getPosts({ category: state.category });
    state.posts = data.posts;
  } catch (error) {
    console.error(error.message);
  }
}

function navigate(view) {
  state.view = view;
  render();
}

async function handleLogin({ email, password }) {
  const data = await loginUser({ email, password });
  state.token = data.token;
  setToken(data.token);
  state.user = await getProfile(state.token);
  navigate("posts");
}

async function handleRegister(formData) {
  const data = await registerUser(formData);
  state.token = data.token;
  setToken(data.token);
  state.user = await getProfile(state.token);
  navigate("posts");
}

function handleLogout() {
  clearToken();
  state.token = null;
  state.user = null;
  navigate("posts");
}

async function handleToggleFavorite(postId, isFavorite) {
  if (!state.user) return;
  if (isFavorite) {
    await removeFavoritePost(state.user._id, postId, state.token);
  } else {
    await addFavoritePost(state.user._id, postId, state.token);
  }
  state.user = await getProfile(state.token);
  render();
}

async function handleDeleteAccount() {
  await deleteAccount(state.user._id, state.token);
  handleLogout();
}

async function handleFilterCategory(category) {
  state.category = category;
  await loadPosts();
  render();
}

function getFavoriteIds() {
  return state.user?.posts?.map((post) => post._id) || [];
}

function render() {
  app.innerHTML = "";

  const header = createHeader({
    user: state.user,
    onNavigate: navigate,
    onLogout: handleLogout,
  });

  let main;
  if (state.view === "login" && !state.user) {
    main = createAuthForm({ onLogin: handleLogin, onRegister: handleRegister });
  } else if (state.view === "profile" && state.user) {
    main = createProfile({
      user: state.user,
      onToggleFavorite: handleToggleFavorite,
      onDeleteAccount: handleDeleteAccount,
    });
  } else {
    main = createPostList({
      posts: state.posts,
      favoriteIds: getFavoriteIds(),
      canFavorite: !!state.user,
      onToggleFavorite: handleToggleFavorite,
      onFilterCategory: handleFilterCategory,
      currentCategory: state.category,
    });
  }

  app.append(header, main);
}

init();
