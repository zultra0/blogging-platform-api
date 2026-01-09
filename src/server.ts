import express, { Request, Response } from "express";
import postsRoutes from "./routes/posts.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/posts", postsRoutes);

app.get("/", (request: Request, response: Response) => {
  response.send("Welcome to my Blogging Platform API");
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
