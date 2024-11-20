import { Request, Response } from "express";
import pool from "../config/db";
import { IExpense } from "../types/expense";

export class ExpenseV2Controller {
  async getExpense(req: Request, res: Response) {
    const result = await pool.query("SELECT * FROM expense");
    const expenses: IExpense[] = result.rows;

    res.status(200).send({ expenses });
  }

  async getExpenseById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM expense WHERE id=${id}`);
    const expenses: IExpense[] = result.rows;

    res.status(200).send({ expenses });
  }

  async newExpense(req: Request, res: Response) {
    const { title, nominal, type, category, date } = req.body;
    await pool.query(
      `INSERT INTO expense (title, nominal, "type", category, "date") values ('${title}', '${nominal}', '${type}', '${category}', '${date}')`
    );

    res.status(200).send({ message: `Expense added!` });
  }

  async deleteExpense(req: Request, res: Response) {
    const { id } = req.params;
    await pool.query(`DELETE FROM expense WHERE id=${id}`);

    res.status(200).send({ message: `Expense id:${id} deleted!` });
  }
}
