import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRouter } from "./router/user.router";
import { BlogRouter } from "./router/blog.router";
import { AuthRouter } from "./router/auth.router";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());
app.use(cors());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Welcome to my API");
});

const userRouter = new UserRouter();
const blogRouter = new BlogRouter();
const authRouter = new AuthRouter();

app.use("/api/users", userRouter.getRouter());
app.use("/api/blogs", blogRouter.getRouter());
app.use("/api/auth", authRouter.getRouter());

console.log(process.env.JWT_KEY);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/api`);
});
