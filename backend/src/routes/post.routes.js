const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");
const { authenticate, isAdmin } = require("../middlewares/auth.middleware");

// Rutas públicas
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Rutas exclusivas de admin
router.post("/", authenticate, isAdmin, createPost);
router.put("/:id", authenticate, isAdmin, updatePost);
router.delete("/:id", authenticate, isAdmin, deletePost);

module.exports = router;
