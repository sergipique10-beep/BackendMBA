const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  getProfile,
  getUserById,
  changeRole,
  updateUser,
  deleteUser,
  addFavoritePost,
  removeFavoritePost,
} = require("../controllers/user.controller");
const { authenticate, isAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// Rutas públicas
router.post("/register", upload.single("image"), register);
router.post("/login", login);

// Rutas autenticadas — rutas específicas ANTES de las paramétricas
router.get("/", authenticate, isAdmin, getAllUsers);
router.get("/profile", authenticate, getProfile);

// Rutas paramétricas
router.get("/:id", authenticate, getUserById);
router.put("/:id/role", authenticate, isAdmin, changeRole);
router.put("/:id", authenticate, upload.single("image"), updateUser);
router.delete("/:id", authenticate, deleteUser);
router.post("/:id/posts", authenticate, addFavoritePost);
router.delete("/:id/posts/:postId", authenticate, removeFavoritePost);

module.exports = router;
