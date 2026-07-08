require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Post = require("../models/Post");
const posts = require("./data/posts.data");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB...");

    await Post.deleteMany();
    console.log("Colección de posts limpiada.");

    const created = await Post.insertMany(posts);
    console.log(`✅ ${created.length} posts insertados correctamente.`);

    created.forEach((p) => console.log(`   - [${p.category}] ${p.title}`));
  } catch (error) {
    console.error("Error en el seed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Conexión cerrada.");
  }
};

seed();
