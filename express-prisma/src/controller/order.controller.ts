import { Request, Response } from "express";
import prisma from "../prisma";
import axios from "axios";

export class OrderController {
  async CreateOrder(req: Request, res: Response) {
    try {
      const { price } = req.body;

      function addMinutes(date: Date, minutes: number) {
        data.setMinutes(date.getMinutes() + minutes);
        return date;
      }

      const date = new Date();
      const newDate = addMinutes(date, 10);
      const order = await prisma.order.create({
        data: {
          price,
          userId: req.user?.id!,
          expiredAt: newDate,
        },
      });

      const body = {
        transaction_details: {
          order_id: order.id,
          gross_amount: price,
        },
        expiry: {
          unit: "minutes",
          duration: 10,
        },
      };

      const { data } = await axios.post(
        "https://app.sandbox.midtrans.com/snap/v1/transactions",
        body,
        { headers: { Authorization: "" } }
      );

      await prisma.order.update({
        data: { redirect_url: data.redirect_url },
        where: { id: order.id },
      });

      res.status(200).send({
        message: "Order created",
        data,
        order,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
