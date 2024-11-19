import { IExpense } from "../types/expense";
import fs from "fs";
import { Request, Response } from "express";

export class ExpenseController {
  getList(req: Request, res: Response) {
    const { title, category, start, end } = req.query;
    let expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expenses.json", "utf-8")
    );

    expenses = expenses.filter((item) => {
      let isValid: boolean = true;
      if (category) {
        isValid = isValid && item.category == category;
      }

      if (title) {
        isValid = isValid && item.title.toLowerCase().includes(title as string);
      }

      if (start && end) {
        const startDate = new Date(start as string);
        const endDate = new Date(end as string);
        const expenseDate = new Date(item.date);

        isValid = isValid && expenseDate >= startDate && expenseDate <= endDate;
      }

      return isValid;
    });

    const nominal_income = expenses
      .filter((item) => item.type == "income")
      .reduce((acc, curr) => acc + curr.nominal, 0);

    const nominal_expense = expenses
      .filter((item) => item.type == "expense")
      .reduce((acc, curr) => acc + curr.nominal, 0);

    res.status(200).send({ nominal_income, nominal_expense, expenses });
  }

  getDetails(req: Request, res: Response) {
    const { id } = req.params;
    const expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expenses.json", "utf-8")
    );

    const data = expenses.find((item) => (item.id = +id));

    res.status(200).send({ expense: data });
  }

  newExpense(req: Request, res: Response) {
    const expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expenses.json", "utf-8")
    );

    const id = Math.max(...expenses.map((item) => item.id)) + 1 || 1;

    const { title, nominal, type, category, date } = req.body;
    const newData: IExpense = { id, title, nominal, type, category, date };
    expenses.push(newData);

    fs.writeFileSync("./db/expenses.json", JSON.stringify(expenses));

    res.status(200).send({ message: "Expense Added", expense: newData });
  }

  editExpense(req: Request, res: Response) {
    const { id } = req.params;
    const expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expenses.json", "utf-8")
    );

    const idx: number = expenses.findIndex((item) => item.id == +id);
    expenses[idx] = { ...expenses[idx], ...req.body };

    fs.writeFileSync("./db/expenses.json", JSON.stringify(expenses));

    res.status(200).send({ message: `Expense id:${id} updated` });
  }

  deleteExpense(req: Request, res: Response) {
    const { id } = req.params;
    const expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expenses.json", "utf-8")
    );

    const newExpenses = expenses.filter((item) => item.id != +id);
    fs.writeFileSync("./db/expenses.json", JSON.stringify(newExpenses));

    res.status(200).send({ message: `Expense with id:${id} deleted!` });
  }

  getTotalByDate(req: Request, res: Response) {
    const { startDate, endDate } = req.query;
    let expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expenses.json", "utf-8")
    );

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const total = expenses
      .filter(
        (item) =>
          item.type === "expense" &&
          new Date(item.date) >= start &&
          new Date(item.date) <= end
      )
      .reduce((acc, curr) => acc + curr.nominal, 0);

    res.status(200).send({ from: start, to: end, total: total });
  }

  getTotalByCategory(req: Request, res: Response) {
    const { category } = req.query;
    let expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expenses.json", "utf-8")
    );

    const total = expenses
      .filter((item) =>
        item.category.toLowerCase().includes((category as string).toLowerCase())
      )
      .reduce((acc, curr) => acc + curr.nominal, 0);

    res.status(200).send({ total: total });
  }
}
