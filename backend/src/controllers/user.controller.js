const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// POST /api/users/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Si se subió imagen pero el usuario ya existe, la eliminamos de Cloudinary
      if (req.file?.filename) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const userData = { name, email, password, role: "user" };

    if (req.file) {
      userData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const user = await User.create(userData);

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    if (req.file?.filename) await cloudinary.uploader.destroy(req.file.filename);
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

// POST /api/users/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login correcto",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// GET /api/users  (solo admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("posts", "title description category");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// GET /api/users/profile  (usuario autenticado)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("posts", "title description category");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error: error.message });
  }
};

// GET /api/users/:id  (admin o el propio usuario)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("posts", "title description category");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Un usuario normal solo puede ver su propio perfil
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "No tienes permiso para ver este usuario" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error: error.message });
  }
};

// PUT /api/users/:id/role  (solo admin)
const changeRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido. Usa 'user' o 'admin'" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: `Rol actualizado a '${role}'`, user });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar rol", error: error.message });
  }
};

// PUT /api/users/:id  (el propio usuario o un admin) — actualiza name/email/image
const updateUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const requesterId = req.user._id.toString();
    const requesterRole = req.user.role;

    if (requesterRole !== "admin" && requesterId !== targetId) {
      if (req.file?.filename) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(403).json({ message: "No tienes permiso para editar este usuario" });
    }

    const user = await User.findById(targetId);
    if (!user) {
      if (req.file?.filename) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (req.file?.filename) await cloudinary.uploader.destroy(req.file.filename);
        return res.status(400).json({ message: "El email ya está registrado" });
      }
      updateData.email = email;
    }

    // Si se sube una imagen nueva, se elimina la anterior de Cloudinary (si no es la de por defecto)
    if (req.file) {
      if (user.image?.public_id) {
        await cloudinary.uploader.destroy(user.image.public_id);
      }
      updateData.image = { url: req.file.path, public_id: req.file.filename };
    }

    const updatedUser = await User.findByIdAndUpdate(targetId, updateData, {
      new: true,
      runValidators: true,
    }).populate("posts", "title description category");

    res.json({ message: "Usuario actualizado correctamente", user: updatedUser });
  } catch (error) {
    if (req.file?.filename) await cloudinary.uploader.destroy(req.file.filename);
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

// DELETE /api/users/:id  (el propio usuario o un admin)
const deleteUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const requesterId = req.user._id.toString();
    const requesterRole = req.user.role;

    // Un usuario normal no puede eliminar otra cuenta que no sea la suya
    if (requesterRole !== "admin" && requesterId !== targetId) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta cuenta" });
    }

    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Eliminar imagen de Cloudinary si no es la por defecto
    if (user.image?.public_id) {
      await cloudinary.uploader.destroy(user.image.public_id);
    }

    await User.findByIdAndDelete(targetId);

    res.json({ message: "Cuenta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

// POST /api/users/:id/posts  — añadir post favorito (sin duplicados, sin pisar los anteriores)
const addFavoritePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.params.id;

    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permiso para modificar esta lista" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Evitar duplicados: comprobamos si el post ya está en el array
    const alreadyAdded = user.posts.some((p) => p.toString() === postId);
    if (alreadyAdded) {
      return res.status(400).json({ message: "Este post ya está en tus favoritos" });
    }

    // $addToSet garantiza que no se duplique a nivel de base de datos
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { posts: postId } },
      { new: true }
    ).populate("posts", "title description category");

    res.json({ message: "Post añadido a favoritos", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al añadir favorito", error: error.message });
  }
};

// DELETE /api/users/:id/posts/:postId  — quitar post favorito
const removeFavoritePost = async (req, res) => {
  try {
    const { id: userId, postId } = req.params;

    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permiso para modificar esta lista" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { posts: postId } },
      { new: true }
    ).populate("posts", "title description category");

    if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Post eliminado de favoritos", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar favorito", error: error.message });
  }
};

module.exports = {
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
};
