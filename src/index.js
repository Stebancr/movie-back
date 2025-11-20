import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import movieRoutes from "./routes/movies.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
