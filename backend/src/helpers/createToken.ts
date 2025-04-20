import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const createUserToken = async (req: Request, res: Response) => {
  const token = jwt.sign({ access: "granted" }, "D_ldpo151@se24", {
    expiresIn: "2h",
  });

  return res.status(200).json({ message: "Acesso permitido.", token: token });
};

export default createUserToken;
