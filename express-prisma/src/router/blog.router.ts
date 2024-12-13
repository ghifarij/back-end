import { Router } from "express";
import { BlogController } from "../controller/blog.controller";
import { checkAdmin, verifyToken } from "../middleware/verify";
import { uploader } from "../services/uploader";

export class BlogRouter {
  private blogController: BlogController;
  private router: Router;

  constructor() {
    this.blogController = new BlogController();
    this.router = Router();
    this.InitializeRoutes();
  }

  private InitializeRoutes() {
    this.router.get("/", this.blogController.getBlogs);
    this.router.post(
      "/",
      verifyToken,
      checkAdmin,
      uploader("memoryStorage", "blog").single("thumbnail"),
      this.blogController.createBlog
    );

    this.router.get("/:slug", this.blogController.getBlogSlug);
  }

  getRouter(): Router {
    return this.router;
  }
}
