import express, { Application, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { ExpenseRouter } from "./routers/expense.router";
import pool from "./config/db";
import { ExpenseV2Router } from "./routers/expensev2.routers";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());
app.use(cors());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Welcome to my expense API");
});

const expenseRouter = new ExpenseRouter();
const expenseV2Router = new ExpenseV2Router();

app.use("/api/expenses", expenseRouter.getRouter());
app.use("/api/v2/expenses", expenseV2Router.getRouter());

pool.connect((err, client, release) => {
  if (err) {
    return console.log("Error acquiring client", err.stack);
  }

  console.log("Success connection ✔");
  release();
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
