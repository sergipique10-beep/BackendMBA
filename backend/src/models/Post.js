const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "El contenido es obligatorio"],
    },
    category: {
      type: String,
      enum: ["tecnología", "ciencia", "cultura", "deportes", "política", "otros"],
      default: "otros",
    },
    author: {
      type: String,
      trim: true,
      default: "Anónimo",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
