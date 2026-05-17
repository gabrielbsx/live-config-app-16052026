import express from "express";
import { routes } from "./routes.js";

async function main() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  routes(app);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main().catch(console.error);
