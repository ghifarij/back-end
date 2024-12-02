import { Request, Response } from "express";
import prisma from "../prisma";
import { genSalt, hash, compare } from "bcrypt";
import { findUser } from "../services/user.service";
import { sign } from "jsonwebtoken";

export class AuthController {
  async RegisterUser(req: Request, res: Response) {
    try {
      const { password, confirmPassword, username, email } = req.body;
      if (password != confirmPassword) throw "Password not match!";

      const user = await findUser(username, email);
      if (user) throw "username or email already exist";

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      await prisma.user.create({
        data: { username, email, password: hashPassword },
      });
      res.status(201).send("Register Successfully ✅");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await findUser(data, data);

      if (!user) throw "Account not found";

      const isValidPass = await compare(password, user.password);
      if (!isValidPass) throw "Wrong password";

      const payload = { id: user.id, role: user.role };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "10m" });

      res.status(200).send({
        message: "Login success✅",
        token,
        user,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
