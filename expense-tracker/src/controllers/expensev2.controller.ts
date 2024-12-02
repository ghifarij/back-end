import { Request, Response } from "express";
import pool from "../config/db";
import { IExpense } from "../types/expense";

export class ExpenseV2Controller {
  async getExpense(req: Request, res: Response) {
    const { category } = req.query;
    let query = "SELECT * FROM expense";

    if (category) {
      query += ` WHERE category = '${category}'`;
    }

    query += " ORDER BY id ASC";
    const result = await pool.query(query);
    const expenses: IExpense[] = result.rows;

    res.status(200).send({ expenses });
  }

  async getExpenseById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM expense WHERE id=${id}`);
    const expenses: IExpense[] = result.rows[0];

    res.status(200).send({ expenses });
  }

  async newExpense(req: Request, res: Response) {
    const { title, nominal, type, category, date } = req.body;
    await pool.query(
      `INSERT INTO expense (title, nominal, type, category, date)
      values ('${title}', ${nominal}, '${type}', '${category}', '${date}')`
    );

    res.status(200).send({ message: `Expense added!` });
  }

  async editExpense(req: Request, res: Response) {
    const query = [];
    const { id } = req.params;
    for (let key in req.body) {
      query.push(`${key} = '${req.body[key]}'`);
    }

    query.join(", ");
    await pool.query(`UPDATE expense SET ${query} WHERE id = ${id}`);

    res.status(200).send({ message: `Expense updated!` });
  }

  async deleteExpense(req: Request, res: Response) {
    const { id } = req.params;
    await pool.query(`DELETE FROM expense WHERE id=${id}`);

    res.status(200).send({ message: `Expense id:${id} deleted!` });
  }
}
