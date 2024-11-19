import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller";
import { ExpenseMiddleware } from "../middlewares/expense.middleware";

export class ExpenseRouter {
  private router: Router;
  private expenseController: ExpenseController;
  private expenseMiddleware: ExpenseMiddleware;

  constructor() {
    this.expenseController = new ExpenseController();
    this.expenseMiddleware = new ExpenseMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.expenseController.getList);
    this.router.post(
      "/",
      this.expenseMiddleware.checkDate,
      this.expenseController.newExpense
    );
    this.router.get(
      "/total-by-category",
      this.expenseController.getTotalByCategory
    );
    this.router.get("/total-by-date", this.expenseController.getTotalByDate);

    this.router.get(
      "/:id",
      this.expenseMiddleware.checkId,
      this.expenseController.getDetails
    );
    this.router.patch(
      "/:id",
      this.expenseMiddleware.checkId,
      this.expenseController.editExpense
    );
    this.router.delete(
      "/:id",
      this.expenseMiddleware.checkId,
      this.expenseController.deleteExpense
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
