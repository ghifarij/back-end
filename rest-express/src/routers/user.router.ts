import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initalizeRoutes();
  }

  private initalizeRoutes() {
    this.router.get("/", this.userController.getUsers);
    this.router.get("/:id", this.userController.getUserId);
    this.router.post("/", this.userController.AddUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
