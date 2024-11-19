import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { IExpense } from "../types/expense";

export class ExpenseMiddleware {
  checkId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expenses.json", "utf-8")
    );

    const data = expenses.find((item) => item.id == +id);

    if (data) {
      next();
    } else {
      res.status(400).send({ message: "Expense not found" });
    }
  }

  checkDate(req: Request, res: Response, next: NextFunction) {
    const { date } = req.body;

    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (dateFormat.test(date)) {
      next();
    } else {
      res
        .status(400)
        .send({ message: "Invalid date format. Expected YYYY-MM-DD" });
    }
  }
}
