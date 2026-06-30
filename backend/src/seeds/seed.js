require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Post = require("../models/Post");

const posts = [
  {
    title: "Introducción a Node.js",
    description: "Todo lo que necesitas saber para empezar con Node.js",
    content:
      "Node.js es un entorno de ejecución de JavaScript del lado del servidor construido sobre el motor V8 de Chrome. Permite ejecutar JavaScript fuera del navegador y es especialmente eficiente para aplicaciones de red en tiempo real gracias a su arquitectura de I/O no bloqueante.",
    category: "tecnología",
    author: "Admin",
  },
  {
    title: "¿Qué es REST API?",
    description: "Guía completa sobre el diseño de APIs RESTful",
    content:
      "REST (Representational State Transfer) es un estilo de arquitectura de software para sistemas distribuidos. Las APIs RESTful utilizan los métodos HTTP (GET, POST, PUT, DELETE) para realizar operaciones sobre recursos identificados por URLs.",
    category: "tecnología",
    author: "Admin",
  },
  {
    title: "MongoDB vs SQL",
    description: "Comparativa entre bases de datos NoSQL y relacionales",
    content:
      "MongoDB es una base de datos NoSQL orientada a documentos que almacena datos en formato BSON (similar a JSON). A diferencia de las bases de datos SQL, no requiere un esquema fijo y escala horizontalmente con facilidad, lo que la hace ideal para aplicaciones modernas.",
    category: "tecnología",
    author: "Admin",
  },
  {
    title: "El Big Bang y los orígenes del universo",
    description: "Un viaje al inicio de todo lo que conocemos",
    content:
      "El modelo del Big Bang describe el origen del universo hace aproximadamente 13.800 millones de años. A partir de un estado de altísima densidad y temperatura, el universo se ha expandido y enfriado hasta llegar a su estado actual.",
    category: "ciencia",
    author: "Admin",
  },
  {
    title: "La IA que cambia el mundo",
    description: "Cómo la inteligencia artificial está transformando la sociedad",
    content:
      "La inteligencia artificial ya no es ciencia ficción. Desde los asistentes virtuales hasta los coches autónomos, la IA está redefiniendo cómo vivimos, trabajamos y nos relacionamos. Los modelos de lenguaje de gran escala han democratizado el acceso a esta tecnología.",
    category: "tecnología",
    author: "Admin",
  },
  {
    title: "Historia del jazz",
    description: "Orígenes y evolución de uno de los géneros más influyentes",
    content:
      "El jazz nació a finales del siglo XIX y principios del XX en Nueva Orleans, Louisiana, fusionando tradiciones musicales africanas y europeas. A lo largo del tiempo ha dado lugar a subgéneros como el bebop, el cool jazz, el jazz fusión y el jazz electrónico.",
    category: "cultura",
    author: "Admin",
  },
  {
    title: "La mente detrás del método científico",
    description: "Francis Bacon y la revolución del pensamiento empírico",
    content:
      "Francis Bacon fue un filósofo inglés del siglo XVII que sentó las bases del método científico moderno. Su insistencia en la observación empírica y la experimentación rigurosa cambió para siempre la forma en que la humanidad busca el conocimiento.",
    category: "ciencia",
    author: "Admin",
  },
  {
    title: "El fenómeno del running urbano",
    description: "Por qué cada vez más personas salen a correr por las ciudades",
    content:
      "En la última década, el running urbano se ha convertido en uno de los deportes más practicados del mundo. Las carreras populares, las aplicaciones de entrenamiento y las comunidades online han democratizado un deporte que solo requiere un par de zapatillas.",
    category: "deportes",
    author: "Admin",
  },
];

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
