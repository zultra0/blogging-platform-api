import "dotenv/config";
import express, { Request, Response } from "express";
import postsRoutes from "./routes/posts.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/posts", postsRoutes);

app.get("/", (req: Request, res: Response) => {
  return res.send("Welcome to my Blogging Platform API");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
