const Post = require("../models/Post");

// GET /api/posts
const getAllPosts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = category ? { category } : {};

    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener posts", error: error.message });
  }
};

// GET /api/posts/:id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el post", error: error.message });
  }
};

// POST /api/posts  (solo admin)
const createPost = async (req, res) => {
  try {
    const { title, description, content, category, author } = req.body;
    const post = await Post.create({ title, description, content, category, author });
    res.status(201).json({ message: "Post creado correctamente", post });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el post", error: error.message });
  }
};

// PUT /api/posts/:id  (solo admin)
const updatePost = async (req, res) => {
  try {
    const { title, description, content, category, author } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, description, content, category, author },
      { new: true, runValidators: true }
    );

    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    res.json({ message: "Post actualizado correctamente", post });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el post", error: error.message });
  }
};

// DELETE /api/posts/:id  (solo admin)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });
    res.json({ message: "Post eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el post", error: error.message });
  }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };
