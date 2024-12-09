import { Router } from "express";
import { OrderController } from "../controller/order.controller";
import { verifyToken } from "../middleware/verify";

export class OrderRouter {
  private orderController: OrderController;
  private router: Router;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", verifyToken, this.orderController.CreateOrder);
  }

  getRouter(): Router {
    return this.router;
  }
}
