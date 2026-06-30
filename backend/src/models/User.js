const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Formato de email inválido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    image: {
      url: {
        type: String,
        default: "https://res.cloudinary.com/demo/image/upload/v1/samples/avatars/default-avatar",
      },
      public_id: {
        type: String,
        default: null,
      },
    },
    // Array de posts favoritos — sin duplicados (controlado en el controlador)
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
