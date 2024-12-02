import { Router } from "express";
import { BlogController } from "../controller/blog.controller";

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

    this.router.get("/:slug", this.blogController.getBlogSlug);
  }

  getRouter(): Router {
    return this.router;
  }
}
